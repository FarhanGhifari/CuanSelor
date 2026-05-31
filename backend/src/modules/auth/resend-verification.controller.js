import { ok } from "../../utils/api-response.js";
import { auth } from "../../config/auth.js";
import { env } from "../../config/env.js";

/**
 * Controller untuk mengirim ulang email verifikasi
 * Menggunakan Better Auth API untuk generate & kirim token baru
 */
export async function resendVerification(req, res) {
  try {
    const { email } = req.body;

    // 1. Validasi input
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    // 2. Gunakan Better Auth API untuk mengirim ulang email verifikasi
    //    Better Auth akan handle: cari user, cek status, generate token, kirim email
    await auth.api.sendVerificationEmail({
      body: {
        email: email.toLowerCase(),
        callbackURL: `${env.frontendUrl}/auth/onboarding`,
      },
    });

    return ok(res, {
      message: "Link verifikasi telah dikirim ulang ke email Anda.",
    });

  } catch (error) {
    console.error("Resend Verification Error:", error);

    // Better Auth melempar error dengan message spesifik
    const message = error?.message || "Terjadi kesalahan pada server";

    // Handle kasus user sudah terverifikasi atau tidak ditemukan
    if (message.includes("verified") || message.includes("not found")) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}