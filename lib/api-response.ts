import { NextResponse } from 'next/server';
import { logger } from './logger';

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
};

// Generates a standardized error response and automatically logs it.
// If fallbackData is provided, it merges it with the error to prevent breaking legacy frontend parsers that do not check res.ok.
export function errorResponse(
  message: string,
  error?: unknown,
  status = 500,
  fallbackData?: any
) {
  const errDetails = error instanceof Error ? error.message : undefined;
  
  const payload = {
    ...fallbackData,
    success: false,
    error: message,
    details: errDetails,
  };
  
  if (status >= 500) {
    logger.error({ err: error, status }, `[API SERVER ERROR] ${message}`);
  } else {
    logger.warn({ err: error, status }, `[API CLIENT ERROR] ${message}`);
  }
  
  return NextResponse.json(payload, { status });
}
