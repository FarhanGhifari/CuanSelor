import type { RegisterInput } from "../validations/auth.schema";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const registerMock = {
    register: async (payload: RegisterInput) => {
        await delay(1200);

        // Simulasi email sudah terdaftar
        if (payload.email === "exists@example.com") {
            return {
                data: null,
                error: { message: "Email sudah terdaftar", status: 409 },
            };
        }

        return {
            data: {
                user: {
                    id: "mock-user-new-001",
                    name: payload.fullName,
                    email: payload.email,
                    emailVerified: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    image: null,
                },
                session: {
                    id: "mock-session-new-001",
                    userId: "mock-user-new-001",
                    token: "mock-token-new-xxxxx",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
            error: null,
        };
    },
};