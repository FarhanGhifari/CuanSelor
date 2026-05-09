// Mock yang bentuknya meniru return value dari Better Auth client
// authClient.signIn.email() return { data, error }

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_USERS = [
    { email: "budi@example.com", password: "password123", name: "Budi Santoso" },
    { email: "test@cuanselor.id", password: "password123", name: "Test User" },
];

export const authMock = {
    signInEmail: async (email: string, password: string) => {
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

        return {
            data: {
                user: {
                    id: "mock-user-001",
                    name: user.name,
                    email: user.email,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                session: {
                    id: "mock-session-001",
                    userId: "mock-user-001",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    token: "mock-session-token",
                },
            },
            error: null,
        };
    },

    signOut: async () => {
        await delay(300);
        return { data: { success: true }, error: null };
    },

    getSession: async () => {
        await delay(400);
        return {
            data: {
                user: {
                    id: "mock-user-001",
                    name: "Budi Santoso",
                    email: "budi@example.com",
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                session: {
                    id: "mock-session-001",
                    userId: "mock-user-001",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    token: "mock-session-token",
                },
            },
            error: null,
        };
    },
};