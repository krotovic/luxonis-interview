import { Apartment } from '@/model/Apartment'
import { createDbClient } from '@/services/DatabaseService'

interface PaginationResult<T> {
  items: T[]
  total: number
  totalPages: number
  nextPage: number | null
  previousPage: number | null
}

export async function getTotalApartmentsFromDb(): Promise<[number, number]> {
  const resultsPerPage = Number(process.env.RESULTS_PER_PAGE ?? 10)
  try {
    const client = await createDbClient()
    const countResult = await client.query<{ count: string }>('SELECT COUNT(*) FROM apartments')
    const total = Number(countResult.rows[0].count)
    return [total, Math.ceil(total / resultsPerPage)]
  } catch (error) {
    console.error(error)
    return [0, 0]
  }
}

export async function loadApartmentsFromDb(page: number = 0): Promise<PaginationResult<Apartment>> {
  try {
    const client = await createDbClient()
    const [total, totalPages] = await getTotalApartmentsFromDb()
    const resultsPerPage = Number(process.env.RESULTS_PER_PAGE ?? 10)
    let nextPage: number | null = null
    let previousPage: number | null = null
    let query = 'SELECT * FROM apartments LIMIT $1'
    let args = [resultsPerPage]
    if (page > 0) {
      const offset = (page - 1) * resultsPerPage
      query = `SELECT * FROM apartments LIMIT $1 OFFSET $2`
      args = [resultsPerPage, offset]
      previousPage = page - 1
    }
    if (page < totalPages) {
      nextPage = page + 1
    }
    const { rows } = await client.query<Apartment>(query, args)
    return {
      items: rows,
      total,
      totalPages,
      nextPage,
      previousPage,
    }
  } catch (error) {
    console.error(error)
    return {
      items: [],
      total: 0,
      totalPages: 0,
      nextPage: null,
      previousPage: null,
    }
  }
}
