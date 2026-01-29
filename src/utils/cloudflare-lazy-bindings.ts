import { getSafeCloudflareContext } from './cloudflare-context'
import type {
  D1Database,
  D1PreparedStatement,
  D1Result,
  D1ExecResult,
  R2Bucket,
} from '@cloudflare/workers-types'

/**
 * ==============================================================================
 * CLOUDFLARE LAZY BINDINGS UTILITY (S+ AUDITED)
 * ==============================================================================
 *
 * PROBLEM:
 * Next.js + OpenNext initializes configuration files (payload.config.ts) at the
 * "Global Scope" (Module Init), before the Cloudflare Request Context is available.
 *
 * Attempting to access `env.D1` or `env.R2` at this stage results in `undefined`
 * or "stale" bindings that cause 500 Internal Server Errors at runtime.
 *
 * SOLUTION:
 * This utility implements the Proxy & Adapter patterns to create "Lazy" versions
 * of D1 and R2. These objects can be safely instantiated globally but only
 * attempt to fetch the Binding from the Request Context when a method (like .run())
 * is actually called.
 *
 * ARCHITECTURE:
 * - LazyD1Database: Proxies D1 calls. Handles Sessions/Transactions correctness.
 * - LazyD1PreparedStatement: Ensures Immutability on .bind() to match native behavior.
 * - LazyR2Bucket: Proxies R2 calls via ES6 Proxy.
 *
 * ==============================================================================
 */

// Define the Session interface locally as it's a subtype of D1Database
interface D1DatabaseSession {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}

/**
 * Helper to resolve the real statement at runtime, handling correct context and session rules.
 */
async function getRealStatementFromSource(
  sourceName: string,
  query: string,
  bindings: any[],
  sessionToken?: string,
): Promise<D1PreparedStatement> {
  const cf = await getSafeCloudflareContext()
  const db = (cf.env as Record<string, any>)[sourceName] as D1Database
  if (!db) throw new Error(`D1 binding '${sourceName}' not found`)

  let target: D1Database | D1DatabaseSession = db
  if (sessionToken) {
    // If we are in a session, we must derive the session instance from the real DB
    target = db.withSession(sessionToken)
  }

  let stmt = target.prepare(query)
  if (bindings.length > 0) {
    stmt = stmt.bind(...bindings)
  }
  return stmt
}

export class LazyD1PreparedStatement implements D1PreparedStatement {
  private query: string
  private bindings: any[] = []
  private dbName: string
  private sessionToken?: string

  constructor(dbName: string, query: string, sessionToken?: string, bindings: any[] = []) {
    this.dbName = dbName
    this.query = query
    this.sessionToken = sessionToken
    this.bindings = bindings
  }

  // AUDIT FIX: D1 bind() follows immutable pattern. Mutating 'this' causes side effects on reused statements.
  bind(...values: any[]): D1PreparedStatement {
    return new LazyD1PreparedStatement(
      this.dbName,
      this.query,
      this.sessionToken,
      values, // New bindings replace old ones
    )
  }

  async first<T = unknown>(colName?: string): Promise<T | null> {
    const stmt = await this._getRealStatement()
    // first() in D1 types is overloaded, simple pass-through is safest
    return stmt.first(colName as any)
  }

  async run<T = unknown>(): Promise<D1Result<T>> {
    const stmt = await this._getRealStatement()
    return stmt.run()
  }

  async all<T = unknown>(): Promise<D1Result<T>> {
    const stmt = await this._getRealStatement()
    return stmt.all()
  }

  async raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<T[]> {
    const stmt = await this._getRealStatement()
    // @ts-ignore - Signature complexity abstraction
    return stmt.raw(options)
  }

  async _getRealStatement(): Promise<D1PreparedStatement> {
    return getRealStatementFromSource(this.dbName, this.query, this.bindings, this.sessionToken)
  }
}

class LazyD1DatabaseSession implements D1DatabaseSession {
  private dbName: string
  private token: string

  constructor(dbName: string, token: string) {
    this.dbName = dbName
    this.token = token
  }

  prepare(query: string): D1PreparedStatement {
    return new LazyD1PreparedStatement(this.dbName, query, this.token)
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const cf = await getSafeCloudflareContext()
    const db = (cf.env as Record<string, any>)[this.dbName] as D1Database
    if (!db) throw new Error(`D1 binding '${this.dbName}' not found`)

    const session = db.withSession(this.token)

    const realStatements = await Promise.all(
      statements.map(async (stmt) => {
        if (stmt instanceof LazyD1PreparedStatement) {
          return stmt._getRealStatement()
        }
        return stmt
      }),
    )
    return session.batch(realStatements)
  }
}

class LazyD1Database implements D1Database {
  private dbName: string

  constructor(dbName: string) {
    this.dbName = dbName
  }

  prepare(query: string): D1PreparedStatement {
    return new LazyD1PreparedStatement(this.dbName, query)
  }

  async dump(): Promise<ArrayBuffer> {
    const db = await this.getDb()
    return db.dump()
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const db = await this.getDb()
    const realStatements = await Promise.all(
      statements.map(async (stmt) => {
        if (stmt instanceof LazyD1PreparedStatement) {
          return stmt._getRealStatement()
        }
        return stmt
      }),
    )
    return db.batch(realStatements)
  }

  async exec(query: string): Promise<D1ExecResult> {
    const db = await this.getDb()
    return db.exec(query)
  }

  withSession(token: string): any {
    return new LazyD1DatabaseSession(this.dbName, token)
  }

  private async getDb(): Promise<D1Database> {
    const cf = await getSafeCloudflareContext()
    const db = (cf.env as Record<string, any>)[this.dbName] as D1Database
    if (!db) {
      console.warn(`[LazyD1] Warning: D1 binding '${this.dbName}' missing in current context.`)
      throw new Error(`D1 Database binding '${this.dbName}' not found`)
    }
    return db
  }
}

export function getLazyD1(bindingName: string = 'D1'): D1Database {
  return new LazyD1Database(bindingName)
}

export function getLazyR2(bindingName: string = 'R2'): R2Bucket {
  return new Proxy({} as R2Bucket, {
    get(_target, prop) {
      return async (...args: any[]) => {
        const cf = await getSafeCloudflareContext()
        const bucket = (cf.env as Record<string, any>)[bindingName] as R2Bucket
        if (!bucket) {
          throw new Error(`R2 Bucket binding '${bindingName}' not found in Cloudflare context`)
        }
        // @ts-ignore
        const method = bucket[prop]
        if (typeof method !== 'function') {
          throw new Error(`Property ${String(prop)} is not a function on R2Bucket`)
        }
        return method.apply(bucket, args)
      }
    },
  })
}
