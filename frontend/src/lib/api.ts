/**
 * API client for communicating with the LTFS backend.
 */

import type { ProcessingResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Upload an audio file to the backend for processing.
 *
 * Sends the file as multipart/form-data and returns the structured
 * extraction response.
 */
export async function processAudio(file: File): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/process-audio`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "An unexpected error occurred";
    let errorDetail: string | undefined;

    try {
      const errorData = await response.json();
      // FastAPI wraps HTTPException detail
      const detail = errorData.detail;
      if (typeof detail === "object" && detail !== null) {
        errorMessage = detail.message || errorMessage;
        errorDetail = detail.detail;
      } else if (typeof detail === "string") {
        errorMessage = detail;
      }
    } catch {
      // Response wasn't JSON
      errorMessage = `Server error (${response.status})`;
    }

    throw new Error(errorDetail ? `${errorMessage}: ${errorDetail}` : errorMessage);
  }

  const data = await response.json();
  return data as ProcessingResponse;
}
