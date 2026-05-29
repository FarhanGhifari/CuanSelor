import { auth } from "../../config/auth.js";
import { sendResetPasswordEmail } from "../../utils/email.js";
import { env } from "../../config/env.js";
import crypto from "crypto";

/**
 * Request password reset - send email with reset link
 */
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log(`[Forgot Password] Request for email: ${email}`);

    // Check if user exists in database
    const db = auth.options.database;
    
    // Better Auth uses lowercase table names with quotes
    const userResult = await db.query(
      'SELECT id, email, name FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if user exists or not (security best practice)
      console.log(`[Forgot Password] User not found: ${email}`);
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    const user = userResult.rows[0];
    console.log(`[Forgot Password] User found: ${user.id}`);

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in verification table
    // Better Auth verification table structure
    await db.query(
      `INSERT INTO "verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [crypto.randomUUID(), email, token, expiresAt]
    );

    console.log(`[Forgot Password] Token created, expires at: ${expiresAt}`);

    // Create reset URL
    const resetUrl = `${env.frontendUrl}/auth/reset-password?token=${token}`;

    // Send email
    const emailResult = await sendResetPasswordEmail({
      user: { email: user.email, name: user.name },
      url: resetUrl,
    });

    if (!emailResult.success) {
      console.error(`[Forgot Password] Failed to send email:`, emailResult.error);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    console.log(`[Forgot Password] Email sent successfully`);

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

    console.log(`[Reset Password] Request with token: ${token.substring(0, 10)}...`);

    const db = auth.options.database;

    // Verify token
    const verificationResult = await db.query(
      'SELECT * FROM "verification" WHERE value = $1',
      [token]
    );

    if (verificationResult.rows.length === 0) {
      console.log(`[Reset Password] Token not found or already used`);
      return res.status(400).json({
        success: false,
        message: "Link sudah digunakan atau tidak valid. Silakan request link reset password baru.",
      });
    }

    const verification = verificationResult.rows[0];

    // Check if token expired
    if (new Date() > new Date(verification.expiresAt)) {
      console.log(`[Reset Password] Token expired`);
      // Delete expired token
      await db.query('DELETE FROM "verification" WHERE value = $1', [token]);
      return res.status(400).json({
        success: false,
        message: "Link sudah kedaluwarsa (expired). Silakan request link reset password baru.",
      });
    }

    const email = verification.identifier;
    console.log(`[Reset Password] Token valid for email: ${email}`);

    // Get user with current password
    const userResult = await db.query(
      'SELECT id, password FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`[Reset Password] User not found: ${email}`);
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // Check if new password is same as old password
    const bcrypt = await import("bcrypt");
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      console.log(`[Reset Password] New password is same as old password`);
      return res.status(400).json({
        success: false,
        message: "Password baru tidak boleh sama dengan password lama. Silakan gunakan password yang berbeda.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in user table
    await db.query(
      'UPDATE "user" SET password = $1, "updatedAt" = NOW() WHERE id = $2',
      [hashedPassword, user.id]
    );

    console.log(`[Reset Password] Password updated for user: ${user.id}`);

    // Delete used token
    await db.query('DELETE FROM "verification" WHERE value = $1', [token]);

    console.log(`[Reset Password] Token deleted`);

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

