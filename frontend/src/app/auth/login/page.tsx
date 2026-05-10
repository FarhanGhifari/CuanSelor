import type { Metadata } from "next";
import LoginForm from '../../../features/auth/components/LoginForm';
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Login - CuanSelor',
    description: "Masuk ke akun CuanSelor Anda",
}

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex bg-[#F9FAFB]">
            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden text-white" 
                 style={{ background: 'linear-gradient(135deg, #1A2E35 0%, #294A52 40%, #87B9B4 100%)' }}>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#34D399] rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-wide">CuanSelor</span>
                </div>

                <div className="relative z-10 mt-auto mb-20">
                    <h1 className="text-5xl font-bold leading-[1.15] mb-6">
                        Your Financial Future Starts<br/>Here
                    </h1>
                    <p className="text-[#B6D6D3] text-lg max-w-md leading-relaxed mb-12 font-medium">
                        Join thousands of Gen Z users who are taking control of their financial future with AI-powered insights and personalized recommendations.
                    </p>

                    <div className="flex gap-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 w-48 shadow-sm">
                            <h3 className="text-[2.5rem] font-bold mb-1 leading-none">50K+</h3>
                            <p className="text-white/80 text-sm font-medium">Active Users</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 w-48 shadow-sm">
                            <h3 className="text-[2.5rem] font-bold mb-1 leading-none">$2M+</h3>
                            <p className="text-white/80 text-sm font-medium">Managed Assets</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
                <div className="w-full max-w-lg">
                    <div className="mb-8 text-center">
                        <h2 className="text-[2.8rem] font-bold text-[#111827] tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-[#6B7280] text-[1.1rem]">Sign in to continue to your dashboard</p>
                    </div>
                    
                    <LoginForm/>
                    
                    <p className="text-center text-sm text-[#6B7280] mt-8">
                        By signing in, you agree to our <Link href="#" className="text-[#10B981] hover:underline font-medium">Terms of Service</Link> and <Link href="#" className="text-[#10B981] hover:underline font-medium">Privacy Policy</Link>
                    </p>
                </div>
                
                <button className="absolute bottom-6 right-6 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                    <span className="text-lg font-medium">?</span>
                </button>
            </div>
        </div>
    )
}