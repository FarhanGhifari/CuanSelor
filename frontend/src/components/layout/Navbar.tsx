"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { useSession } from "@/lib/auth/auth-client";

const NAV_LINK = [
    { label: "About", href: "/#about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { data: session, isPending } = useSession();
    const isAuthenticated = Boolean(session?.user);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return (
        <nav
            style={{
                position: "fixed",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 32px)",
                maxWidth: 1536,
                borderRadius: 16,
                zIndex: 50,
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                border: "1px solid rgba(15, 23, 42, 0.05)",
                boxShadow: "0 12px 40px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.02)",
                padding: "10px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center relative h-12 w-48 overflow-hidden">
                <img
                    src="/CuanSelor.png"
                    alt="CuanSelor Logo"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-auto object-cover max-w-none"
                    style={{ filter: "none" }} // No brightness filter in light mode to keep dark logo visible
                />
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
                {NAV_LINK.map((link) => {
                    const isHash = link.href.startsWith("/#");
                    const isActive = !isHash && pathname === link.href;

                    const linkStyle: React.CSSProperties = {
                        color: isActive ? "#10B981" : "rgba(15, 23, 42, 0.65)",
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        transition: "color 0.2s",
                        textDecoration: "none",
                    };

                    if (isHash) {
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                style={linkStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(15, 23, 42, 0.65)")}
                            >
                                {link.label}
                            </a>
                        );
                    }
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={linkStyle}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#0F172A"; }}
                            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(15, 23, 42, 0.65)"; }}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
                {!mounted || isPending ? (
                    <span
                        style={{
                            fontSize: 14,
                            color: "rgba(15, 23, 42, 0.5)",
                            fontWeight: 500,
                        }}
                    >
                        Memeriksa...
                    </span>
                ) : isAuthenticated ? (
                    <Link
                        href={ROUTES.DASHBOARD}
                        className="transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #10B981, #14B8A6)",
                            color: "#ffffff",
                            borderRadius: 12,
                            padding: "8px 18px",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 6px 24px rgba(16,185,129,0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.25)";
                        }}
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={ROUTES.LOGIN}
                            style={{
                                fontSize: 14,
                                color: "rgba(15, 23, 42, 0.65)",
                                textDecoration: "none",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(15, 23, 42, 0.65)")}
                        >
                            Login
                        </Link>
                        <Link
                            href={ROUTES.REGISTER}
                            className="transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, #10B981, #14B8A6)",
                                color: "#ffffff",
                                borderRadius: 12,
                                padding: "8px 18px",
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                                boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 6px 24px rgba(16,185,129,0.35)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.25)";
                            }}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
