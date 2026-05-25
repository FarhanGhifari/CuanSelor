import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

export async function predictFinancialSegment(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.aiServiceTimeoutMs);

  try {
    const response = await fetch(`${env.aiServiceUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }
    }

    if (!response.ok) {
      throw new AppError("AI service gagal memproses profil risiko", 502, {
        status: response.status,
        response: data,
      });
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new AppError("AI service timeout. Coba lagi beberapa saat.", 504);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Tidak bisa menghubungi AI service", 502, error.message);
  } finally {
    clearTimeout(timeout);
  }
}
