import puppeteer, { type Page } from 'puppeteer'
import { Client } from 'pg'

const EXPECTED_RESULTS = Number(process.env.RESULTS_COUNT ?? 100)
let resultsCounter = 0
let client: Client

async function initDatabase() {
  const tableExists = await client.query(`
      SELECT EXISTS (SELECT 1
                     FROM information_schema.tables
                     WHERE table_name = 'apartments') AS table_existence;`)

  if (Boolean(tableExists.rows[0].table_existence)) {
    console.log('Found existing table, dropping it')
    await client.query(`
        DROP TABLE apartments;
    `)
  }

  await client.query(`
      CREATE TABLE IF NOT EXISTS apartments
      (
          id
                SERIAL
              PRIMARY
                  KEY,
          title
                VARCHAR(255) NOT NULL,
          image VARCHAR(255) NOT NULL
      );
  `)
}

async function saveApartment(title: string, image: string) {
  const index = resultsCounter + 1
  console.log(`Apartment ${index}: ${title}`)
  try {
    const result = await client.query(
      `
        INSERT INTO apartments (title, image)
        VALUES ($1, $2)
    `,
      [title, image],
    )
    if (result.rowCount !== 1) {
      console.error(`Error while saving apartment ${index}: ${result.rowCount} rows affected`)
    }
  } catch (error) {
    console.error(`Error while saving apartment ${index}`, error)
  }
  resultsCounter++
}

async function scrapePage(page: Page) {
  try {
    const result = await page.waitForSelector(`.property-list .dir-property-list`)
    const apartments = await result?.$$('.property')
    for (const apartment of apartments ?? []) {
      const title = await apartment.$eval('.info .title span.name', (el) => el.innerText)
      const image = await apartment.$eval('preact[component="property-carousel"] a:first-of-type img', (el) => el.src)
      await saveApartment(title, image)
    }
  } catch (error) {
    console.error(error)
  }
}

async function scrapeWebPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()

  try {
    console.log(
      `connecting to database postgres://${process.env.DB_HOST}:${process.env.DB_PORT ?? 5432}/${process.env.DB_NAME}`,
    )
    client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })
    await client.connect()
  } catch (error) {
    console.error('Error while establishing database connection', error)
    process.exit(1)
  }

  try {
    await initDatabase()
  } catch (error) {
    console.error('Error while initializing database', error)
    process.exit(1)
  }

  await page.goto('https://www.sreality.cz/en/search/for-sale/apartments')
  let pageNumber = 1
  while (true) {
    await scrapePage(page)
    if (resultsCounter + 1 >= EXPECTED_RESULTS) break
    pageNumber++
    await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${pageNumber}`)
  }

  await client.end()
  await page.close()
  await browser.close()
  console.log(`Scraped ${resultsCounter} apartments`)
}

scrapeWebPage()
