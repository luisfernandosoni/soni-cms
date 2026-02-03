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
export const POST = (req: any, context: any) => {
  const contentType = req.headers.get('content-type') || ''
  const contentLength = req.headers.get('content-length') || 'unknown'
  console.log(`[VC_ELITE_DEBUG] Payload API POST: ${req.url} - Type: ${contentType}, Length: ${contentLength}`)
  return REST_POST(config)(req, context)
}
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
