import Link from "next/link";

const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "FAQ", href: "/#faq" },
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
        <footer className="w-full bg-muted py-8 px-8 lg:px-16 border-t border-border">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative h-10 w-40 overflow-hidden">
                                <img src="/logo.png" alt="CuanSelor Logo" className="absolute left-0 top-1/2 -translate-y-1/2 h-20 w-auto object-cover max-w-none" />
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Your AI-powered financial advisor for a secure future.
                        </p>
                    </div>

                    {/* Link groups */}
                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title}>
                            <h4 className="font-semibold text-foreground mb-4">{group.title}</h4>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CuanSelor. All rights reserved.
                </div>
            </div>
        </footer>
    );
}