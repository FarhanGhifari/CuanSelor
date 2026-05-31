import { Resend } from 'resend';
import { env } from "../config/env.js";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Fungsi pengiriman email utama
 */
async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY belum dikonfigurasi di server");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${env.emailFromName} <onboarding@resend.dev>`,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message || "Gagal mengirim email");
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("[Email] Resend Error:", error);
    throw error instanceof Error ? error : new Error("Gagal mengirim email");
  }
}

/**
 * Template Email yang kamu inginkan
 */
const getEmailTemplate = (title, content, buttonText, url, footerNote) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 40px 40px 20px; text-align: center;">
                <h1 style="margin: 0; color: #10B981; font-size: 28px; font-weight: 700;">CuanSelor</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px;">
                <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 24px; font-weight: 600;">${title}</h2>
                <p style="margin: 0 0 24px; color: #64748B; font-size: 16px; line-height: 1.6;">${content}</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10B981, #14B8A6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 16px rgba(16,185,129,0.25);">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                  Atau copy dan paste link ini ke browser Anda:<br>
                  <a href="${url}" style="color: #10B981; word-break: break-all;">${url}</a>
                </p>
                <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">${footerNote}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="margin: 0; color: #94A3B8; font-size: 12px;">© ${new Date().getFullYear()} CuanSelor. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function sendVerificationEmail({ user, url }) {
  const html = getEmailTemplate(
    "Verifikasi Email Anda",
    "Halo! Terima kasih sudah mendaftar di CuanSelor. Klik tombol di bawah untuk verifikasi email Anda.",
    "Verifikasi Email",
    url,
    "Link ini akan kadaluarsa dalam 24 jam. Jika Anda tidak mendaftar di CuanSelor, abaikan email ini."
  );

  return sendEmail({ to: user.email, subject: "Verifikasi Email Anda - CuanSelor", html });
}

export async function sendResetPasswordEmail({ user, url }) {
  const html = getEmailTemplate(
    "Reset Password",
    "Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah untuk membuat password baru.",
    "Reset Password",
    url,
    "Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini."
  );

  return sendEmail({ to: user.email, subject: "Reset Password - CuanSelor", html });
}