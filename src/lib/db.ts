import { createClient } from '@libsql/client'

const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
})

export async function dbGet<T = any>(sql: string, ...args: any[]): Promise<T | undefined> {
    const result = await client.execute({ sql, args })
    return result.rows[0] as T | undefined
}

export async function dbAll<T = any>(sql: string, ...args: any[]): Promise<T[]> {
    const result = await client.execute({ sql, args })
    return result.rows as T[]
}

export async function dbRun(sql: string, ...args: any[]) {
    return client.execute({ sql, args })
}

export async function dbBatch(statements: { sql: string; args: any[] }[]) {
    return client.batch(statements, 'write')
}

export { client as db }
