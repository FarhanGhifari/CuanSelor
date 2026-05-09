import Link from "next/link";
import { TrendingUp, Brain, Target, Shield, Zap, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center relative h-full w-64">
              <img src="/logo.png" alt="CuanSelor Logo" className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-auto" />
            </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#why-us" className="text-muted-foreground hover:text-foreground transition-colors">Why Us</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link
              href="/financial-form"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                AI-Powered Financial Advisor for Gen Z
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Plan Your Financial Freedom with AI
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Smart financial planning made simple. Get personalized recommendations,
                retirement projections, and AI-driven insights to secure your financial future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/financial-form"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  Get Started
                  <TrendingUp className="w-5 h-5" />
                </Link>
                <Link
                  href="/retirement-projection"
                  className="px-8 py-4 bg-background text-foreground border border-border rounded-xl hover:bg-muted transition-all shadow-sm"
                >
                  Try Simulation
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card rounded-2xl shadow-2xl p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary rounded-xl p-4 text-primary-foreground shadow-sm">
                      <div className="text-sm opacity-90 mb-1">Total Balance</div>
                      <div className="text-2xl font-semibold">Rp 24.580.000</div>
                      <div className="text-xs opacity-80 mt-1">+12.5% this month</div>
                    </div>
                    <div className="bg-[#56A8F9] rounded-xl p-4 text-white shadow-sm">
                      <div className="text-sm text-white/90 mb-1">Savings</div>
                      <div className="text-2xl font-semibold">Rp 8.240.000</div>
                      <div className="text-xs text-white/80 mt-1">+8.3% this month</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Retirement Goal</span>
                      <span className="text-sm font-medium text-primary">65%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-linear-to-r from-primary to-[#56A8F9] w-2/3"></div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-2">AI Recommendation</div>
                    <div className="text-sm text-foreground">
                      Invest Rp 7,500,000 more monthly to reach retirement goal by 2050
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30 border-y border-border/40 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to plan your financial future</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Financial Analysis</h3>
              <p className="text-muted-foreground">
                AI-powered analysis of your income, expenses, and spending patterns to optimize your finances
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI Recommendation</h3>
              <p className="text-muted-foreground">
                Get personalized investment and savings recommendations based on your risk profile and goals
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Retirement Projection</h3>
              <p className="text-muted-foreground">
                Visualize your retirement savings growth with inflation adjustments and scenario planning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 px-6 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose CuanSelor?</h2>
            <p className="text-lg text-muted-foreground">Built for the modern generation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">Bank-level encryption to keep your financial data safe</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Smart recommendations tailored to your unique situation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Gen Z Focused</h3>
              <p className="text-muted-foreground">Designed for the financial needs of young professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-muted/50 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl"></div>
              <img 
                src="/about-visual.png" 
                alt="About CuanSelor" 
                className="relative rounded-2xl shadow-2xl border border-border"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                More Than Just a Financial App
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                CuanSelor was born from the need of Gen Z for a smart, personal financial 
                advisor that can be accessed anytime. We combine cutting-edge AI technology 
                with proven financial management principles to help you make better 
                financial decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Financial Inclusion</h4>
                    <p className="text-sm text-muted-foreground">Providing access to quality financial advice for everyone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Artificial Intelligence</h4>
                    <p className="text-sm text-muted-foreground">Using data to provide accurate future projections and insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="CuanSelor Logo" className="h-16 w-auto" />
              </div>
              <p className="text-muted-foreground text-sm">
                Your AI-powered financial advisor for a secure future
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Features</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Pricing</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">FAQ</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">About</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Careers</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Privacy</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Terms</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Security</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 CuanSelor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
