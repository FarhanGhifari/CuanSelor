import Link from "next/link";
import { TrendingUp, Brain, Zap, Target, Shield, Users } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export function HomePage() {
    return (
        <>
            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="w-full min-h-screen flex items-center px-8 lg:px-16 pt-20">
                <div className="max-w-screen-2xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div>
                            <div
                                className="inline-block px-4 py-2 rounded-full text-sm mb-6"
                                style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                            >
                                AI-Powered Financial Advisor for Gen Z
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                                Plan Your Financial Freedom with AI
                            </h1>

                            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-xl">
                                Smart financial planning made simple. Get personalized recommendations,
                                retirement projections, and AI-driven insights to secure your financial future.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={ROUTES.REGISTER}
                                    className="inline-flex items-center gap-2 px-10 py-4 text-white rounded-xl
                    hover:opacity-90 transition-all shadow-lg shadow-emerald-100 text-lg font-medium"
                                    style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
                                >
                                    Get Started
                                    <TrendingUp className="w-5 h-5" />
                                </Link>
                                <Link
                                    href={ROUTES.PROJECTION}
                                    className="inline-flex items-center px-10 py-4 bg-white text-gray-900
                    border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-lg text-lg font-medium"
                                >
                                    Try Simulation
                                </Link>
                            </div>
                        </div>

                        {/* Right — Dashboard Preview Card */}
                        <div className="relative group transition-all duration-700 hover:scale-[1.03] hover:-rotate-1">
                            <div
                                className="absolute inset-0 rounded-3xl blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(16,185,129,0.4), rgba(20,184,166,0.4))",
                                }}
                            />
                            <div className="relative bg-white rounded-2xl shadow-2xl p-10 border border-gray-100 transition-all duration-700 group-hover:shadow-emerald-200/50">
                                {/* Window dots */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>

                                <div className="space-y-4">
                                    {/* Balance cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className="rounded-xl p-5 text-white transition-transform duration-500 group-hover:scale-[1.02]"
                                            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                                        >
                                            <div className="text-sm opacity-90 mb-1">Total Balance</div>
                                            <div className="text-3xl font-semibold">$24,580</div>
                                            <div className="text-xs opacity-80 mt-1">+12.5% this month</div>
                                        </div>
                                        <div
                                            className="rounded-xl p-5 text-white transition-transform duration-500 group-hover:scale-[1.02]"
                                            style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}
                                        >
                                            <div className="text-sm opacity-90 mb-1">Savings</div>
                                            <div className="text-3xl font-semibold">$8,240</div>
                                            <div className="text-xs opacity-80 mt-1">+8.3% this month</div>
                                        </div>
                                    </div>

                                    {/* Retirement progress */}
                                    <div className="bg-gray-50 rounded-xl p-5 transition-colors duration-500 group-hover:bg-gray-100/80">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-500">Retirement Goal</span>
                                            <span className="text-sm font-medium text-emerald-500">65%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full w-2/3 transition-all duration-1000 group-hover:w-[70%]"
                                                style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
                                            />
                                        </div>
                                    </div>

                                    {/* AI recommendation */}
                                    <div className="bg-gray-50 rounded-xl p-5 transition-colors duration-500 group-hover:bg-gray-100/80">
                                        <div className="text-sm text-gray-500 mb-2">AI Recommendation</div>
                                        <div className="text-sm text-gray-900 italic">
                                            &quot;Invest $500 more monthly to reach retirement goal by 2050&quot;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ───────────────────────────────────────── */}
            <section id="features" className="w-full py-24 px-8 lg:px-16 bg-white">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-500">
                            Everything you need to plan your financial future
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Brain,
                                bg: "rgba(16,185,129,0.1)",
                                color: "#10b981",
                                title: "Financial Analysis",
                                desc: "AI-powered analysis of your income, expenses, and spending patterns to optimize your finances.",
                            },
                            {
                                icon: Zap,
                                bg: "rgba(20,184,166,0.1)",
                                color: "#14b8a6",
                                title: "AI Recommendation",
                                desc: "Get personalized investment and savings recommendations based on your risk profile and goals.",
                            },
                            {
                                icon: Target,
                                bg: "rgba(16,185,129,0.1)",
                                color: "#10b981",
                                title: "Retirement Projection",
                                desc: "Visualize your retirement savings growth with inflation adjustments and scenario planning.",
                            },
                        ].map(({ icon: Icon, bg, color, title, desc }) => (
                            <div
                                key={title}
                                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10
                  border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                                    style={{ background: bg }}
                                >
                                    <Icon className="w-7 h-7" style={{ color }} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                                <p className="text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY US ─────────────────────────────────────────── */}
            <section id="why-us" className="w-full py-24 px-8 lg:px-16 bg-gray-50">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose CuanSelor?
                        </h2>
                        <p className="text-xl text-gray-500">Built for the modern generation</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Shield,
                                gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
                                title: "Secure & Private",
                                desc: "Bank-level encryption to keep your financial data safe.",
                            },
                            {
                                icon: Brain,
                                gradient: "linear-gradient(135deg, #14b8a6, #10b981)",
                                title: "AI-Powered",
                                desc: "Smart recommendations tailored to your unique situation.",
                            },
                            {
                                icon: Users,
                                gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
                                title: "Gen Z Focused",
                                desc: "Designed for the financial needs of young professionals.",
                            },
                        ].map(({ icon: Icon, gradient, title, desc }) => (
                            <div key={title} className="text-center group">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                    style={{ background: gradient }}
                                >
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                                <p className="text-gray-500 text-lg">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}