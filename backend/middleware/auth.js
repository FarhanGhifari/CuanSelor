require("dotenv").config();

const NEXT_APP_URL = process.env.NEXT_APP_URL || "http://localhost:3000";

/**
 * Better Auth Session Forwarding Middleware
 *
 * Better Auth mengelola session via cookie httpOnly.
 * Middleware ini mem-forward cookie dari request ke Next.js
 * endpoint GET /api/auth/get-session untuk verifikasi user.
 */
async function authenticateToken(req, res, next) {
  const cookie = req.headers.cookie;
  if (!cookie) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No session cookie",
    });
  }

  try {
    const response = await fetch(`${NEXT_APP_URL}/api/auth/get-session`, {
      method: "GET",
      headers: { cookie },
    });

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid session",
      });
    }

    const session = await response.json();

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No active session",
      });
    }

    // Attach user ke request — tersedia di semua route handler
    req.user = session.user;
    next();
  } catch (error) {
    console.error("[Auth Middleware] Session verification failed:", error.message);
    return res.status(503).json({
      success: false,
      message: "Auth service unavailable",
    });
  }
}

// Optional middleware — tidak error jika tidak ada session
async function optionalAuth(req, res, next) {
  const cookie = req.headers.cookie;
  if (!cookie) {
    req.user = null;
    return next();
  }

  try {
    const response = await fetch(`${NEXT_APP_URL}/api/auth/get-session`, {
      method: "GET",
      headers: { cookie },
    });

    if (response.ok) {
      const session = await response.json();
      req.user = session?.user || null;
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }

  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
};
