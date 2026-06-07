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
  console.log("Raw API Response JSON:", data);

  // If the backend returns a 200 OK and has a status of success OR has the data object, treat it as a success.
  // This explicitly removes any logic that would throw an error on a successful 200 response with data.
  if (data.status === "success" || data.data) {
    // Force the status to be "success" so the UI types match correctly
    data.status = "success";
    return data as ProcessingResponse;
  }

  // Only throw an error if the 200 response was explicitly marked as an error and had no data
  throw new Error(data.message || "An unexpected error occurred during processing.");
}
