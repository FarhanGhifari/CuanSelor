import { env } from "../config/env.js";
import nodemailer from "nodemailer";

// Create Gmail SMTP transporter
let transporter;

if (env.gmailUser && env.gmailAppPassword) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword,
    },
  });
} else {
  console.warn("[Email] Gmail SMTP not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
}

/**
 * Send email using Gmail SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!transporter) {
    console.warn("[Email] Gmail SMTP not configured. Email not sent:", { to, subject });
    return { success: false, error: "Email provider not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: `${env.emailFromName} <${env.gmailUser}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error("[Email] Gmail SMTP error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail({ user, url }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Email Anda</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #10B981; font-size: 28px; font-weight: 700;">CuanSelor</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 24px; font-weight: 600;">Verifikasi Email Anda</h2>
                    <p style="margin: 0 0 24px; color: #64748B; font-size: 16px; line-height: 1.6;">
                      Halo! Terima kasih sudah mendaftar di CuanSelor. Klik tombol di bawah untuk verifikasi email Anda dan mulai merencanakan masa depan finansial Anda.
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10B981, #14B8A6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 16px rgba(16,185,129,0.25);">
                            Verifikasi Email
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      Atau copy dan paste link ini ke browser Anda:<br>
                      <a href="${url}" style="color: #10B981; word-break: break-all;">${url}</a>
                    </p>
                    
                    <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      Link ini akan kadaluarsa dalam 24 jam. Jika Anda tidak mendaftar di CuanSelor, abaikan email ini.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                    <p style="margin: 0; color: #94A3B8; font-size: 12px;">
                      © ${new Date().getFullYear()} CuanSelor. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: "Verifikasi Email Anda - CuanSelor",
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail({ user, url }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #10B981; font-size: 28px; font-weight: 700;">CuanSelor</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 16px; color: #0F172A; font-size: 24px; font-weight: 600;">Reset Password</h2>
                    <p style="margin: 0 0 24px; color: #64748B; font-size: 16px; line-height: 1.6;">
                      Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah untuk membuat password baru.
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10B981, #14B8A6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 16px rgba(16,185,129,0.25);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      Atau copy dan paste link ini ke browser Anda:<br>
                      <a href="${url}" style="color: #10B981; word-break: break-all;">${url}</a>
                    </p>
                    
                    <p style="margin: 24px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                    <p style="margin: 0; color: #94A3B8; font-size: 12px;">
                      © ${new Date().getFullYear()} CuanSelor. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: "Reset Password - CuanSelor",
    html,
  });
}
