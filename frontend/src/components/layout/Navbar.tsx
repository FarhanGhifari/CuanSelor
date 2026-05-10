"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

const NAV_LINK = [
    { label: "Features", href: "/#features" },
    { label: "Why Us", href: "/#why-us" },
    { label: "About", href: "/#about" },
];

export function Navbar() {
    const pathname = usePathname();
    const isLanding = pathname === "/";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 py-4 flex items-center justify-between">

                {/**Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900">CuanSelor</span>
                </Link>

                {/* Nav links — hanya tampil di landing page */}
                {isLanding && (
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINK.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link
                        href={ROUTES.LOGIN}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href={ROUTES.REGISTER}
                        className={cn(
                            "px-5 py-2.5 text-sm text-white rounded-xl transition-all",
                            "shadow-lg shadow-emerald-100 hover:opacity-90"
                        )}
                        style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}