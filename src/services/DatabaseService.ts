import type { Client } from 'pg'

let client: Client

export async function createDbClient() {
  if (!client) {
    const { Client } = await import('pg')
    client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })
    await client.connect()
  }
  return client
}
