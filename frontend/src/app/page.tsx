import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/features/homepage/components/HomePage";

export const metadata: Metadata = {
    title: "CuanSelor - Your Partner for fearless Financial Freedom",
    description: "AI-powered financial advisor untuk Gen Z Indonesia.",
};

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-white">
            <Navbar />
            <main className="w-full">
                <HomePage />
            </main>
            <Footer />
        </div>
    );
}
