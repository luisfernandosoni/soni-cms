import { NextResponse } from 'next/server'
import { getSafeCloudflareContext } from '@/utils/cloudflare-context'

export async function GET() {
  try {
    const cf = await getSafeCloudflareContext()
    
    // Test D1
    let d1_test = 'NOT_TESTED'
    try {
      const d1 = (cf.env as any).D1 as any
      if (d1) {
        const result = await d1.prepare('SELECT 1 as test').first()
        d1_test = JSON.stringify(result)
      } else {
        d1_test = 'MISSING_BINDING'
      }
    } catch (e: any) {
      d1_test = `ERROR: ${e.message}`
    }

    // Test R2
    let r2_test = 'NOT_TESTED'
    try {
      const r2 = (cf.env as any).R2 as any
      if (r2) {
        const list = await r2.list({ limit: 1 })
        r2_test = `LIST_OK (${list.objects.length} objects)`
      } else {
        r2_test = 'MISSING_BINDING'
      }
    } catch (e: any) {
      r2_test = `ERROR: ${e.message}`
    }

    return NextResponse.json({
      node_env: process.env.NODE_ENV,
      payload_secret_present: !!process.env.PAYLOAD_SECRET,
      d1_test,
      r2_test,
      cf_env_keys: Object.keys(cf.env || {}),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}
