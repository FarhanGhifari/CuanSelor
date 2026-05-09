"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { authMock } from "../services/auth.mock";
import { ROUTES } from "@/lib/constants/routes";
import type { LoginInput } from "../validations/auth.schema";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ── useSession (langsung dari Better Auth) ────────────────────
// Gunakan ini di komponen untuk cek apakah user sudah login
// Contoh: const { data: session, isPending } = useSession()
export { useSession } from "@/lib/auth/auth-client";

// useLogin
export function useLogin() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ email, password }: LoginInput) => {
        setIsPending(true);
        setError(null);

        try {
            if (IS_MOCK) {
                const { data, error: mockErr } = await authMock.signInEmail(email, password);
                if (mockErr || !data) {
                    setError(mockErr?.message ?? "Login gagal");
                    return;
                }

                router.push(ROUTES.DASHBOARD);
                router.refresh();
                return;
            }

            const { data, error: authErr } = await authClient.signIn.email({
                email,
                password,
                callbackURL: ROUTES.DASHBOARD,
                rememberMe: true,
            });

            if (authErr) {
                setError(authErr.message ?? "Email atau password salah");
                return;
            }
            router.push(ROUTES.DASHBOARD);
            router.refresh();
        } finally {
            setIsPending(false);
        }

    };

    return { login, isPending, error };
};

// useLogout
export function useLogout() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const logout = async () => {
        setIsPending(true);
        try {
            if (IS_MOCK) {
                await authMock.signOut();
                router.push(ROUTES.LOGIN);
                return;
            }

            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push(ROUTES.LOGIN);
                        router.refresh();
                    },
                },
            });
        } finally {
            setIsPending(false);
        }
    }

    return { logout, isPending };
};

export function useGoogleLogin() {
    const [isPending, setIsPending] = useState(false);

    const loginWithGoogle = async () => {
        setIsPending(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: ROUTES.DASHBOARD,
            });
        } finally {
            setIsPending(false);
        }
    };

    return { loginWithGoogle, isPending };
}