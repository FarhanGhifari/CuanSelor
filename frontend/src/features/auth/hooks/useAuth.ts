"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { authMock } from "../services/auth.mock";
import { ROUTES } from "@/lib/constants/routes";
import type { LoginInput, PersonalInfoInput, RegisterInput } from "../validations/auth.schema";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ── useSession ────────────────────────────────────────────────
// Cek apakah user sudah login + ambil data user
// Contoh: const { data: session, isPending } = useSession()
export { useSession } from "@/lib/auth/auth-client";


// ── useLogin ──────────────────────────────────────────────────
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

      // ── Real Better Auth ──────────────────────────────────
      const { error: authErr } = await authClient.signIn.email({
        email,
        password,
        callbackURL: ROUTES.DASHBOARD,
        rememberMe: true,
        fetchOptions: {
          onError: (ctx) => setError(ctx.error.message ?? "Email atau password salah"),
          onSuccess: () => { router.push(ROUTES.DASHBOARD); router.refresh(); },
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


// Di useAuth.ts — bagian useRegister
// Ganti ROUTES.DASHBOARD → ROUTES.ONBOARDING
// Setelah akun dibuat, user diarahkan ke wizard onboarding dulu

export function useRegister() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterInput) => {
    setIsPending(true);
    setError(null);

    try {
      if (IS_MOCK) {
        const { data, error: mockErr } = await authMock.register(payload);
        if (mockErr || !data) {
          setError(mockErr?.message ?? "Registrasi gagal");
          return false;
        }
        router.push(ROUTES.ONBOARDING); // ← ke onboarding, bukan dashboard
        router.refresh();
        return true;
      }

      const { error: authErr } = await authClient.signUp.email({
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        fetchOptions: {
          onError: (ctx) => setError(ctx.error.message ?? "Registrasi gagal"),
          onSuccess: () => {
            router.push(ROUTES.ONBOARDING); // ← ke onboarding, bukan dashboard
            router.refresh();
          },
        },
      });

      if (authErr) {
        setError(authErr.message ?? "Registrasi gagal");
        return false;
      }

      return true;
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { register, isPending, error };
}


// ── useGoogleLogin ────────────────────────────────────────────
export function useGoogleLogin() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      await authClient.signIn.social({
        provider: "google",
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
  const router = useRouter();
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
          onSuccess: () => { router.push(ROUTES.LOGIN); router.refresh(); },
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  return { logout, isPending };
}