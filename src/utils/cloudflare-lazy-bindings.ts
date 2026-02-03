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

  async raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<any> {
    const stmt = await this._getRealStatement()
    // @ts-ignore - Signature complexity abstraction caused build failure
    return stmt.raw(options) as any
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

/**
 * REFINED LAZY R2 BUCKET (S+ AUDITED)
 * 
 * Uses a more advanced Proxy handler to ensure that:
 * 1. Synchronous property checks (for method existence) return truthy values immediately.
 * 2. Asynchronous method calls trigger context resolution.
 * 3. Standard JS symbols and properties (like .then, .constructor) are handled correctly.
 */
export function getLazyR2(bindingName: string = 'R2'): R2Bucket {
  return new Proxy({} as R2Bucket, {
    get(_target, prop) {
      // Define core R2 methods that need to be proxied as async functions
      const r2Methods = ['get', 'put', 'head', 'delete', 'list', 'createMultipartUpload', 'resumeMultipartUpload'];
      
      if (typeof prop === 'string' && r2Methods.includes(prop)) {
        return async (...args: any[]) => {
          const cf = await getSafeCloudflareContext();
          const bucket = (cf.env as Record<string, any>)[bindingName] as R2Bucket;
          
          if (!bucket) {
            console.error(`[LazyR2] Critical: R2 binding '${bindingName}' missing in Cloudflare Context.`);
            throw new Error(`R2 Bucket binding '${bindingName}' not found.`);
          }
          
          const method = (bucket as any)[prop];
          if (typeof method !== 'function') {
            throw new Error(`Property ${String(prop)} is not a function on the resolved R2Bucket`);
          }
          
          console.log(`[LazyR2] R2 EXEC: ${String(prop)}`, {
            argsCount: args.length,
            bucketName: bindingName,
          })
          
          const result = await method.apply(bucket, args);

          console.log(`[LazyR2] R2 SUCCESS: ${String(prop)}`);

          // SURGICAL MULTIPART BRIDGE (Supreme Board Directive)
          // Payload 3 / S3-SDK expects the result of createMultipartUpload to be an object 
          // with bindable methods like .uploadPart() and .complete().
          if (prop === 'createMultipartUpload' || prop === 'resumeMultipartUpload') {
            return new Proxy(result, {
              get(t, p) {
                const val = (t as any)[p];
                if (typeof val === 'function') {
                  return async (...mArgs: any[]) => {
                    console.log(`[LazyR2] MULTIPART EXEC: ${String(p)}`);
                    const mResult = await val.apply(t, mArgs);
                    // Handle nested success if necessary (e.g. uploadPart returns part info)
                    return mResult;
                  };
                }
                return val;
              }
            });
          }

          return result;
        };
      }

      // Handle standard JS/Node inspection properties
      if (prop === 'then') return undefined; // Avoid blocking async/await logic
      if (prop === 'constructor') return Object.prototype.constructor;
      if (prop === 'name') return bindingName; // Return binding name for identification
      if (prop === 'toString') return () => `[LazyR2Bucket binding=${bindingName}]`;
      if (typeof prop === 'symbol') return (_target as any)[prop];

      // Return undefined for non-existing sync properties to avoid breaking logic checks
      return (_target as any)[prop];
    },
    
    // Explicitly define that these methods 'exist' to satisfy presence checks in library init
    has(_target, prop) {
      const r2Methods = ['get', 'put', 'head', 'delete', 'list', 'name'];
      return typeof prop === 'string' && r2Methods.includes(prop);
    },
    
    // Support for Object.keys/Object.getOwnPropertyNames
    ownKeys() {
      return ['get', 'put', 'head', 'delete', 'list'];
    },
    
    getOwnPropertyDescriptor(_target, prop) {
      if (['get', 'put', 'head', 'delete', 'list'].includes(prop as string)) {
        return {
          enumerable: true,
          configurable: true,
          writable: false,
        };
      }
      return undefined;
    }
  });
}
