/**
 * Standard error extraction helper for asynchronous API operations.
 * Safely extracts a human-readable message from unknown error objects.
 */
export function getErrorMessage(error: unknown, fallback: string = "An unexpected error occurred."): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.length > 0) {
    return error;
  }
  return fallback;
}
