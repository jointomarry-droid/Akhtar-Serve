import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { ApiResponse } from "./validations";

export function successResponse<T>(data: T, meta?: ApiResponse["meta"]): NextResponse {
  const response: ApiResponse<T> = {
    status: "success",
    data,
    meta,
    errors: [],
    requestId: uuidv4(),
  };
  return NextResponse.json(response);
}

export function errorResponse(
  errors: string[],
  status = 400
): NextResponse {
  const response: ApiResponse = {
    status: "error",
    data: null,
    errors,
    requestId: uuidv4(),
  };
  return NextResponse.json(response, { status });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return successResponse(data, {
    page,
    limit,
    total,
    hasNext: page * limit < total,
  });
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse([message], 401);
}

export function notFoundResponse(message = "Not found"): NextResponse {
  return errorResponse([message], 404);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse {
  return errorResponse([message], 403);
}

export function internalErrorResponse(message = "Internal server error"): NextResponse {
  return errorResponse([message], 500);
}
