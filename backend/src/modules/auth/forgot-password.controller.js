import { auth } from "../../config/auth.js";
import { sendResetPasswordEmail } from "../../utils/email.js";
import { env } from "../../config/env.js";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import crypto from "crypto";

/**
 * Helper function to delete verification token
 */
async function deleteVerificationToken(db, token) {
  await db.query('DELETE FROM "verification" WHERE value = $1', [token]);
}

/**
 * Request password reset - send email with reset link
 */
export async function requestPasswordReset(req, res) {
  try {
    const normalizedEmail = req.body?.email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists in database and has local password credentials
    const db = auth.options.database;

    const userResult = await db.query(
      `SELECT u.id, u.email, u.name
       FROM "user" u
       INNER JOIN "account" a ON a."userId" = u.id
       WHERE u.email = $1 AND a.password IS NOT NULL
       LIMIT 1`,
      [normalizedEmail],
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in verification table
    // Better Auth verification table structure
    await db.query(
      `INSERT INTO "verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [crypto.randomUUID(), normalizedEmail, token, expiresAt],
    );

    // Create reset URL
    const resetUrl = `${env.frontendUrl}/auth/reset-password?token=${token}`;

    // Send email
    const emailResult = await sendResetPasswordEmail({
      user: { email: user.email, name: user.name },
      url: resetUrl,
    });

    if (!emailResult.success) {
      console.error(
        `[Forgot Password] Failed to send email:`,
        emailResult.error,
      );
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("[Forgot Password] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const db = auth.options.database;

    // Verify token
    const verificationResult = await db.query(
      'SELECT * FROM "verification" WHERE value = $1',
      [token],
    );

    if (verificationResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Link sudah digunakan atau tidak valid. Silakan request link reset password baru.",
      });
    }

    const verification = verificationResult.rows[0];

    // Check if token expired
    if (new Date() > new Date(verification.expiresAt)) {
      // Delete expired token
      await deleteVerificationToken(db, token);
      return res.status(400).json({
        success: false,
        message:
          "Link sudah kedaluwarsa (expired). Silakan request link reset password baru.",
      });
    }

    const email = verification.identifier;

    // Better Auth menyimpan hash password di tabel "account", bukan di "user".
    const accountResult = await db.query(
      `SELECT u.id AS "userId", a.id AS "accountId", a.password
       FROM "user" u
       INNER JOIN "account" a ON a."userId" = u.id
       WHERE u.email = $1 AND a.password IS NOT NULL
       LIMIT 1`,
      [email],
    );

    if (accountResult.rows.length === 0) {
      await deleteVerificationToken(db, token);
      return res.status(400).json({
        success: false,
        message:
          "Email ini tidak memiliki akun login dengan password. Jika biasanya masuk dengan Google, silakan gunakan tombol Google.",
      });
    }

    const account = accountResult.rows[0];

    // Check if new password is same as old password
    let isSamePassword = false;
    try {
      isSamePassword = await verifyPassword({
        hash: account.password,
        password: newPassword,
      });
    } catch {
      // Hash lama yang pernah tersimpan dengan format salah tetap boleh dioverwrite.
    }

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password baru tidak boleh sama dengan password lama. Silakan gunakan password yang berbeda.",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password hash pada account credentials milik user
    await db.query(
      'UPDATE "account" SET password = $1, "updatedAt" = NOW() WHERE id = $2',
      [hashedPassword, account.accountId],
    );

    // Delete used token
    await deleteVerificationToken(db, token);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("[Reset Password] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
