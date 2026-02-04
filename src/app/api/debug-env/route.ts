import { apiResponse, apiError } from '@/utils/api-utils'
import { getSafeCloudflareContext } from '@/utils/cloudflare-context'

export async function GET() {
  try {
    const cf = await getSafeCloudflareContext()
    
    // Test D1
    let d1_test: any = 'NOT_TESTED'
    try {
      const d1 = (cf.env as any).D1 as any
      if (d1) {
        d1_test = await d1.prepare('SELECT 1 as test').first()
      } else {
        d1_test = { status: 'MISSING_BINDING' }
      }
    } catch (e: any) {
      d1_test = { status: 'ERROR', message: e.message }
    }

    // Test R2
    let r2_test: any = 'NOT_TESTED'
    try {
      const r2 = (cf.env as any).R2 as any
      if (r2) {
        const list = await r2.list({ limit: 1 })
        r2_test = { status: 'OK', count: list.objects.length }
      } else {
        r2_test = { status: 'MISSING_BINDING' }
      }
    } catch (e: any) {
      r2_test = { status: 'ERROR', message: e.message }
    }

    return apiResponse({
      node_env: process.env.NODE_ENV,
      payload_secret_present: !!process.env.PAYLOAD_SECRET,
      d1_test,
      r2_test,
      cf_env_keys: Object.keys(cf.env || {}),
    })
  } catch (err: any) {
    return apiError(err.message, 'CONTEXT_ERROR', 500, { stack: err.stack })
  }
}
