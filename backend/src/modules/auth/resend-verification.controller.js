import { ok } from "../../utils/api-response.js";
import { sendVerificationEmail } from "../../utils/email.js";
import { db } from "../../config/supabase.js";

/**
 * Controller untuk mengirim ulang email verifikasi
 */
export async function resendVerification(req, res) {
  try {
    const { email } = req.body;

    // 1. Validasi input
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    // 2. Cari user di database
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    // 3. Cek apakah sudah terverifikasi
    if (user.emailVerified) {
      return res.status(400).json({ message: "Akun sudah terverifikasi" });
    }

    // 4. Generate ulang token (atau ambil token yang tersimpan jika ada)
    // Catatan: Karena kamu pakai Better Auth, pastikan kamu mengikuti alur 
    // pembuatan token yang konsisten dengan sistemmu
    const token = user.verificationToken; // Ambil dari database jika ada

    // 5. Kirim email via Resend
    // Kita panggil tanpa await agar request frontend tidak 'hang' menunggu SMTP
    sendVerificationEmail({ 
      user: { email: user.email }, 
      url: `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}` 
    }).catch(err => console.error("Email gagal dikirim:", err));

    return ok(res, { 
      message: "Link verifikasi telah dikirim ulang ke email Anda." 
    });

  } catch (error) {
    console.error("Resend Verification Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}