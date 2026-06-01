"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { authMock } from "../services/auth.mock";
import { ROUTES } from "@/lib/constants/routes";
import { buildAuthRedirectUrl } from "../utils/auth-redirect-url";
import type { LoginInput, RegisterInput } from "../validations/auth.schema";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export { useSession } from "@/lib/auth/auth-client";

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

      const { error: authErr } = await authClient.signIn.email({
        email,
        password,
        callbackURL: buildAuthRedirectUrl(ROUTES.AUTH_CALLBACK),
        rememberMe: true,
        fetchOptions: {
          onError: (ctx) => setError(ctx.error.message ?? "Email atau password salah"),
        },
      });

      if (authErr) setError(authErr.message ?? "Email atau password salah");
      else {
        const { data: session } = await authClient.getSession({
          query: { disableCookieCache: true },
        });

        if (!session?.user) {
          setError("Login berhasil, tapi sesi belum terbaca. Coba refresh halaman.");
          return;
        }

        router.replace(ROUTES.AUTH_CALLBACK);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return { login, isPending, error };
}

export function useRegister() {
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
        return true;
      }

      const { error: authErr } = await authClient.signUp.email({
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        fetchOptions: {
          onError: (ctx) => setError(ctx.error.message ?? "Registrasi gagal"),
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
        callbackURL: buildAuthRedirectUrl(ROUTES.AUTH_CALLBACK),
      });
    } catch (err) {
      console.error("Google login exception:", err);
      setError("Google login gagal. Coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return { loginWithGoogle, isPending, error };
}

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
