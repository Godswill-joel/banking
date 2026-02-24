"use client";

import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode;
}

// Bitcoin Icon Component
const BitcoinIcon = ({ size = 60, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="10" fill="#F7931A" />
        <path d="M16.5 10.5C16.5 9.5 15.8 8.5 14.5 8.3V6.5H13V8.2C12.7 8.2 12.4 8.2 12.1 8.2V6.5H10.6V8.3C10.4 8.3 10.1 8.3 9.9 8.3H8.5V9.9H9.5C9.9 9.9 10 10.1 10 10.3V13.7C10 13.9 9.9 14.1 9.5 14.1H8.5V15.8H9.9C10.1 15.8 10.4 15.8 10.6 15.8V17.5H12.1V15.8C12.4 15.8 12.7 15.8 13 15.8V17.5H14.5V15.7C16.2 15.5 17.3 14.6 17.3 13.2C17.3 12.2 16.8 11.5 15.9 11.2C16.3 10.9 16.5 10.7 16.5 10.5ZM13 10.2V11.7H14C14.6 11.7 15 11.4 15 11C15 10.6 14.6 10.2 14 10.2H13ZM14.3 14.5H13V12.8H14.3C15 12.8 15.4 13.1 15.4 13.6C15.4 14.2 15 14.5 14.3 14.5Z" fill="white" />
    </svg>
);

// Beautiful Loading Screen Component
export const BitcoinLoadingScreen = () => {
    const [loadingText, setLoadingText] = useState(0);
    const messages = [
        "Connecting to blockchain...",
        "Verifying credentials...",
        "Syncing wallet data...",
        "Preparing your dashboard..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="relative flex justify-center items-center h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="w-full h-full animate-grid-flow"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Floating Bitcoin Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    >
                        <BitcoinIcon size={20 + Math.random() * 30} className="opacity-30" />
                    </div>
                ))}
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2s" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Rotating Bitcoin Ring */}
                <div className="relative mb-12">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 animate-spin-slow">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 45}deg) translateY(-80px) translateX(-15px)`
                                }}
                            >
                                <BitcoinIcon size={30} className="opacity-40" />
                            </div>
                        ))}
                    </div>

                    {/* Center Bitcoin */}
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping-slow">
                            <div className="w-32 h-32 rounded-full bg-orange-500/30" />
                        </div>
                        <div className="relative backdrop-blur-xl bg-white/5 border-4 border-orange-500/50 rounded-full p-6 shadow-2xl shadow-orange-500/50 animate-float-vertical">
                            <BitcoinIcon size={80} />
                        </div>
                    </div>
                </div>

                {/* Loading Bar */}
                <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden mb-8 backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 animate-loading-bar bg-[length:200%_100%]" />
                </div>

                {/* Text Animation */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white animate-pulse-text">
                        Initializing Secure Connection
                    </h2>
                    <p className="text-lg text-orange-400 font-medium animate-fade-slide min-h-[28px]" key={loadingText}>
                        {messages[loadingText]}
                    </p>
                </div>

                {/* Blockchain Dots */}
                <div className="flex gap-3 mt-12">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-orange-500 rounded-full animate-bounce-sequence"
                            style={{
                                animationDelay: `${i * 0.15}s`
                            }}
                        />
                    ))}
                </div>

                {/* Blockchain Network Lines */}
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    <svg className="w-full h-full">
                        {[...Array(6)].map((_, i) => (
                            <line
                                key={i}
                                x1={`${Math.random() * 100}%`}
                                y1={`${Math.random() * 100}%`}
                                x2={`${Math.random() * 100}%`}
                                y2={`${Math.random() * 100}%`}
                                stroke="#F97316"
                                strokeWidth="1"
                                className="animate-dash-draw"
                                strokeDasharray="5,5"
                                style={{ animationDelay: `${i * 0.5}s` }}
                            />
                        ))}
                    </svg>
                </div>
            </div>  
        </div>
    );
};

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/admin-login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <BitcoinLoadingScreen />;
    }

    return <>{children}</>;
}