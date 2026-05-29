const AUTH_ERROR_MESSAGES: Record<string, string> = {
  account_not_linked:
    "Email ini sudah terdaftar. Kami sudah mengaktifkan penautan akun Google, silakan coba masuk dengan Google lagi.",
  access_denied: "Akses Google dibatalkan. Silakan coba lagi.",
  email_not_found: "Akun Google ini tidak mengirimkan email. Gunakan akun Google lain.",
  invalid_code: "Sesi login Google sudah kedaluwarsa. Silakan coba lagi.",
  oauth_provider_not_found: "Provider Google belum aktif di konfigurasi auth.",
  unable_to_create_user: "Akun Google belum bisa dibuat. Silakan coba lagi.",
  unable_to_get_user_info: "Kami belum bisa membaca profil Google kamu.",
};

export function getAuthErrorMessage(error?: string | null) {
  if (!error) return null;

  return (
    AUTH_ERROR_MESSAGES[error] ??
    "Login Google belum berhasil. Silakan coba lagi."
  );
}
