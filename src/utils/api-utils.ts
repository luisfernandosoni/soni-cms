import { NextResponse } from 'next/server'

/**
 * Standard API Response Structure
 */
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

/**
 * Success Response Helper
 */
export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  )
}

/**
 * Error Response Helper
 */
export function apiError(
  message: string,
  code: string = 'INTERNAL_ERROR',
  status: number = 500,
  details?: any,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  )
}
