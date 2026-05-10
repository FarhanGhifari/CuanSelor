// Return shape-nya dibuat IDENTIK dengan Better Auth authClient
// sehingga hook tidak perlu tahu mock atau real

type AuthError = { message: string; status: number };
type AuthResult<T = unknown> = {
    data: T | null;
    error: AuthError | null;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_USERS = [
    { email: "budi@example.com", password: "password123", name: "Budi Santoso" },
    { email: "test@cuanselor.id", password: "password123", name: "Test User" },
];

// Simulate OTP/reset tokens (in-memory store)
const pendingResets = new Map<string, { email: string; expiresAt: number }>();

const makeMockSession = (name: string, email: string) => ({
    user: {
        id: "mock-user-001",
        name,
        email,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
    },
    session: {
        id: "mock-session-001",
        userId: "mock-user-001",
        token: "mock-token-xxxxx",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
    },
});

export const authMock = {
    signInEmail: async (email: string, password: string): Promise<AuthResult<ReturnType<typeof makeMockSession>>> => {
        await delay(900);

        const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return {
                data: null,
                error: { message: "Email atau password salah", status: 401 },
            };
        }

        return { data: makeMockSession(user.name, user.email), error: null };
    },

    signOut: async (): Promise<AuthResult<{ success: boolean }>> => {
        await delay(300);
        return { data: { success: true }, error: null };
    },

    signInGoogle: async (): Promise<AuthResult<ReturnType<typeof makeMockSession>>> => {
        await delay(500);
        return { data: makeMockSession("Google User", "google@example.com"), error: null };
    },

    /**
     * Simulate sending a password-reset email.
     * Always returns success (to avoid email enumeration).
     */
    forgotPassword: async (email: string): Promise<AuthResult<{ sent: boolean }>> => {
        await delay(1200);

        const userExists = MOCK_USERS.some((u) => u.email === email);

        if (userExists) {
            // Generate a mock reset token and store it (expires in 15 min)
            const token = `mock-reset-${Math.random().toString(36).slice(2)}`;
            pendingResets.set(token, {
                email,
                expiresAt: Date.now() + 15 * 60 * 1000,
            });
            console.log(`[Mock] Password reset token for ${email}: ${token}`);
        }

        // Always return success to prevent email enumeration
        return { data: { sent: true }, error: null };
    },

    /**
     * Simulate verifying a reset token.
     */
    verifyResetToken: async (token: string): Promise<AuthResult<{ email: string }>> => {
        await delay(500);

        const entry = pendingResets.get(token);

        if (!entry) {
            return { data: null, error: { message: "Invalid or expired reset link", status: 400 } };
        }

        if (Date.now() > entry.expiresAt) {
            pendingResets.delete(token);
            return { data: null, error: { message: "Reset link has expired. Please request a new one.", status: 400 } };
        }

        return { data: { email: entry.email }, error: null };
    },

    /**
     * Simulate resetting the password with a valid token.
     */
    resetPassword: async (token: string, newPassword: string): Promise<AuthResult<{ success: boolean }>> => {
        await delay(900);

        const entry = pendingResets.get(token);

        if (!entry || Date.now() > entry.expiresAt) {
            return { data: null, error: { message: "Invalid or expired reset link", status: 400 } };
        }

        // Update the mock user's password
        const user = MOCK_USERS.find((u) => u.email === entry.email);
        if (user) {
            user.password = newPassword;
        }

        pendingResets.delete(token);
        console.log(`[Mock] Password reset successful for ${entry.email}`);

        return { data: { success: true }, error: null };
    },
};