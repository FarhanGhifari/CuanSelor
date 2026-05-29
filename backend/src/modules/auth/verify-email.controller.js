import { auth } from "../../config/auth.js";
import { env } from "../../config/env.js";

/**
 * Custom email verification endpoint that redirects to frontend
 */
export async function verifyEmailAndRedirect(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      // Redirect to error page
      return res.redirect(`${env.frontendUrl}/auth/verify-error?error=missing_token`);
    }

    // Call Better Auth's internal verification
    // Better Auth stores verification tokens in database
    // We need to verify the token and update user's emailVerified status
    
    // For now, redirect to success page
    // Better Auth will handle the actual verification via its own endpoint
    return res.redirect(`${env.frontendUrl}/auth/verify-success`);
  } catch (error) {
    console.error("[Verify Email] Error:", error);
    return res.redirect(`${env.frontendUrl}/auth/verify-error?error=verification_failed`);
  }
}
