"use client";

import { useState }        from "react";
import { useRouter }       from "next/navigation";
import { authClient }      from "@/lib/auth/auth-client";
import { authMock }        from "../services/auth.mock";
import { ROUTES }          from "@/lib/constants/routes";
import type { LoginInput } from "../validations/auth.schema";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ── useSession ────────────────────────────────────────────────
// Cek apakah user sudah login + ambil data user
// Pakai di komponen manapun:
//   const { data: session, isPending } = useSession()
//   session?.user.name, session?.user.email
export { useSession } from "@/lib/auth/auth-client";


// ── useLogin ──────────────────────────────────────────────────
export function useLogin() {
  const router                    = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError]         = useState<string | null>(null);

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

      // ── Real Better Auth ──────────────────────────────────
      const { error: authErr } = await authClient.signIn.email({
        email,
        password,
        callbackURL: ROUTES.DASHBOARD,
        rememberMe:  true,
        fetchOptions: {
          onError: (ctx) => {
            setError(ctx.error.message ?? "Email atau password salah");
          },
          onSuccess: () => {
            router.push(ROUTES.DASHBOARD);
            router.refresh();
          },
        },
      });

      if (authErr) setError(authErr.message ?? "Email atau password salah");

    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return { login, isPending, error };
}


// ── useGoogleLogin ────────────────────────────────────────────
export function useGoogleLogin() {
  const router                    = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const loginWithGoogle = async () => {
    setIsPending(true);
    setError(null);

    try {
      if (IS_MOCK) {
        const { data, error: mockErr } = await authMock.signInGoogle();
        if (mockErr || !data) {
          setError(mockErr?.message ?? "Google login gagal");
          return;
        }
        router.push(ROUTES.DASHBOARD);
        router.refresh();
        return;
      }

      // ── Real Better Auth Google OAuth ─────────────────────
      await authClient.signIn.social({
        provider:    "google",
        callbackURL: ROUTES.DASHBOARD,
      });

    } catch {
      setError("Google login gagal. Coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return { loginWithGoogle, isPending, error };
}


// ── useLogout ─────────────────────────────────────────────────
export function useLogout() {
  const router                    = useRouter();
  const [isPending, setIsPending] = useState(false);

  const logout = async () => {
    setIsPending(true);
    try {
      if (IS_MOCK) {
        await authMock.signOut();
        router.push(ROUTES.LOGIN);
        router.refresh();
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
  };

  return { logout, isPending };
}