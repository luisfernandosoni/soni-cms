/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = async (req: any, context: any) => {
  const contentType = req.headers.get('content-type') || ''
  const contentLength = req.headers.get('content-length') || 'unknown'
  const origin = req.headers.get('origin') || 'none'
  const referer = req.headers.get('referer') || 'none'
  
  console.log(`[VC_ELITE_DEBUG] Payload API POST: ${req.url}`)
  console.log(`[VC_ELITE_DEBUG] Request: Type=${contentType}, Len=${contentLength}, Origin=${origin}, Referer=${referer}`)
  
  try {
    const clonedReq = req.clone()
    const formData = await clonedReq.formData()
    const file = formData.get('file')
    if (file && typeof file !== 'string') {
      console.log(`[VC_ELITE_DEBUG] Manual File Check: name=${(file as any).name}, size=${(file as any).size}, type=${(file as any).type}`)
    } else {
      console.log(`[VC_ELITE_DEBUG] Manual File Check: NO FILE FOUND in formData`)
    }
  } catch (err: any) {
    console.error(`[VC_ELITE_DEBUG] Manual formData parse FAILED: ${err.message}`)
  }

  try {
    const res = await REST_POST(config)(req, context)
    if (res.status >= 400) {
      console.log(`[VC_ELITE_DEBUG] Payload returned status: ${res.status}`)
      try {
        const clonedRes = res.clone()
        const text = await clonedRes.text()
        console.log(`[VC_ELITE_DEBUG] Error Body: ${text.substring(0, 500)}`)
      } catch (e) {
        console.log(`[VC_ELITE_DEBUG] Could not read error body`)
      }
    }
    return res
  } catch (err: any) {
    console.error(`[VC_ELITE_DEBUG] FATAL Payload API Error:`, err.message)
    if (err.stack) console.error(err.stack)
    throw err
  }
}
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
