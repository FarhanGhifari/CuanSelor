import Link from "next/link";
import { TrendingUp } from "lucide-react";

const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/pricing" },
            { label: "FAQ", href: "/faq" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="w-full py-12 px-8 lg:px-16" style={{ background: "#1a2e2a" }}>
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}
                            >
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-white">CuanSelor</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Your AI-powered financial advisor for a secure future.
                        </p>
                    </div>

                    {/* Link groups */}
                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-semibold text-white mb-4">{group.title}</h4>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/60 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
                    © {new Date().getFullYear()} CuanSelor. All rights reserved.
                </div>
            </div>
        </footer>
    );
}