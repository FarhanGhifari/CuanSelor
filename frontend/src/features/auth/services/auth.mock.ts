// Return shape-nya dibuat IDENTIK dengan Better Auth authClient
// sehingga hook tidak perlu tahu mock atau real

type AuthError = { message: string; status: number };
type AuthResult = {
    data: ReturnType<typeof makeMockSession> | null;
    error: AuthError | null;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_USERS = [
    { email: "budi@example.com", password: "password123", name: "Budi Santoso" },
    { email: "test@cuanselor.id", password: "password123", name: "Test User" },
];

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
    signInEmail: async (email: string, password: string): Promise<AuthResult> => {
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

    signOut: async () => {
        await delay(300);
        return { data: { success: true }, error: null };
    },

    signInGoogle: async (): Promise<AuthResult> => {
        await delay(500);
        // Di mock, simulasi langsung sukses
        return { data: makeMockSession("Google User", "google@example.com"), error: null };
    },
};