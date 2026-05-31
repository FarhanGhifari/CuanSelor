/* eslint-disable @next/next/no-img-element */

type AuthLoadingScreenProps = {
  message?: string;
  subtitle?: string;
};

export function AuthLoadingScreen({
  message = "Memuat...",
  subtitle,
}: AuthLoadingScreenProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      <div className="animate-bounce-gentle">
        <img
          src="/projection-illustration.svg"
          alt="Loading..."
          className="w-48 h-48 md:w-56 md:h-56 drop-shadow-lg"
        />
      </div>
      <p className="mt-8 text-lg font-semibold text-gray-700">{message}</p>
      {subtitle ? (
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
