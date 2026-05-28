import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

/**
 * Call FastAPI calculator service via HTTP
 * @param {Object} inputPayload - User profile data untuk kalkulasi
 * @returns {Promise<Object>} Hasil kalkulasi dari FastAPI
 */
export async function callFastAPICalculator(inputPayload) {
  const url = `${env.projectionServiceUrl}/calculate`;

  console.log(`[FASTAPI CLIENT] Calling ${url}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.projectionTimeoutMs);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        `FastAPI service error (${response.status})`,
        response.status,
        errorText
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new AppError("Kalkulasi gagal", 502, result.error);
    }

    console.log(
      `[FASTAPI CLIENT] Success (${result.computation_time?.toFixed(2)}s, ${result.data?.n_simulations || "?"} simulations)`
    );

    return result.data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new AppError(
        `FastAPI service timeout (> ${env.projectionTimeoutMs}ms)`,
        504
      );
    }

    if (error instanceof AppError) {
      throw error;
    }

    // Network error atau connection refused
    throw new AppError(
      `Gagal terhubung ke projection service: ${error.message}. Pastikan streamlit-ds FastAPI berjalan di ${env.projectionServiceUrl}`,
      503,
      error.message
    );
  }
}
