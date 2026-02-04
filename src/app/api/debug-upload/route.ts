import { NextRequest } from 'next/server'
import { apiResponse, apiError } from '@/utils/api-utils'

export async function POST(req: NextRequest) {
  try {
    console.log('[DEBUG_UPLOAD] Request received')
    const contentType = req.headers.get('content-type') || ''
    console.log('[DEBUG_UPLOAD] Content-Type:', contentType)

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return apiError('No file provided', 'MISSING_FILE', 400)
    }

    if (file instanceof File) {
      console.log(`[DEBUG_UPLOAD] File received: ${file.name}, size: ${file.size}, type: ${file.type}`)
      return apiResponse({ 
        name: file.name, 
        size: file.size, 
        type: file.type 
      })
    }

    return apiError('Provided data is not a file', 'INVALID_FILE', 400)
  } catch (error: any) {
    console.error('[DEBUG_UPLOAD] Error:', error)
    return apiError(error.message, 'UPLOAD_HANDLER_ERROR', 500)
  }
}
