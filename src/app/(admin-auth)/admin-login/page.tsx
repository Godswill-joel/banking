'use client';

import React, { useState } from 'react';
import { loginUser } from '@/firebase/config';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import bgImage from '../../../../public/assets/ai-and-crypto-main.jpg';


const BitcoinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#F7931A" />
        <path d="M16.5 10.5C16.5 9.5 15.8 8.5 14.5 8.3V6.5H13V8.2C12.7 8.2 12.4 8.2 12.1 8.2V6.5H10.6V8.3C10.4 8.3 10.1 8.3 9.9 8.3H8.5V9.9H9.5C9.9 9.9 10 10.1 10 10.3V13.7C10 13.9 9.9 14.1 9.5 14.1H8.5V15.8H9.9C10.1 15.8 10.4 15.8 10.6 15.8V17.5H12.1V15.8C12.4 15.8 12.7 15.8 13 15.8V17.5H14.5V15.7C16.2 15.5 17.3 14.6 17.3 13.2C17.3 12.2 16.8 11.5 15.9 11.2C16.3 10.9 16.5 10.7 16.5 10.5ZM13 10.2V11.7H14C14.6 11.7 15 11.4 15 11C15 10.6 14.6 10.2 14 10.2H13ZM14.3 14.5H13V12.8H14.3C15 12.8 15.4 13.1 15.4 13.6C15.4 14.2 15 14.5 14.3 14.5Z" fill="white" />
    </svg>
);

interface Coin {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
}

interface Coin {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
}



export default function GlassLoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: 'famosestarph@gmail.com', password: 'password123' });
    const [isLoading, setIsLoading] = useState(false);
    const [coins, setCoins] = useState<Coin[]>([]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Create explosion of coins
        const newCoins: Coin[] = [];
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 3 + Math.random() * 4;
            newCoins.push({
                id: Date.now() + i,
                x: 0,
                y: 0,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20
            });
        }
        setCoins(newCoins);
        const res = await loginUser(formData.username, formData.password);

        setTimeout(() => {
            setIsLoading(false);
            setCoins([]);

            if (!res.success) {
                alert(`Login failed: ${res.message}`);
            } else {
                console.log("Logged in user:", res.user);
               router.push('/panel') 
            }
        }, 1500);
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Rotating Background Image */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[200%] h-[200%] animate-rotate-slow">
                    <Image
                        src={bgImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-blue-900/60"></div>
            </div>

            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="w-full h-full animate-grid-move"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                {/* Glass Login Card */}
                <div className="w-full max-w-md animate-float-up">
                    {/* Image Header */}
                    <div className="relative h-48 rounded-t-3xl overflow-hidden mb-[-2rem]">
                        <Image
                            src={bgImage}
                            alt="Header"
                            fill
                            className="object-cover animate-ken-burns"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute inset-0 flex items-end justify-center pb-6">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center animate-pulse-glow">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                        <h1 className="text-3xl font-bold text-white text-center mb-2 animate-fade-in">
                            Welcome Back
                        </h1>
                        <p className="text-white/60 text-center mb-8 animate-fade-in animation-delay-200">
                            Sign in to continue
                        </p>

                        <div className="space-y-5">
                            <div className="animate-slide-in-left">
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all backdrop-blur-sm hover:bg-white/15"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="animate-slide-in-right">
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all backdrop-blur-sm hover:bg-white/15"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-pink-400 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="relative w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-pink-500/50 transition-all hover:scale-105 animate-shimmer bg-[length:200%_100%] mt-6 overflow-hidden disabled:cursor-not-allowed"
                            >
                                {/* Rolling Bitcoin Icons */}
                                {!isLoading && (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-start animate-coin-roll-right">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={`right-${i}`}
                                                    className="mx-4 animate-spin-slow"
                                                    style={{ animationDelay: `${i * 0.3}s` }}
                                                >
                                                    <BitcoinIcon />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-end animate-coin-roll-left">
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={`left-${i}`}
                                                    className="mx-4 animate-spin-slow"
                                                    style={{ animationDelay: `${i * 0.3}s` }}
                                                >
                                                    <BitcoinIcon />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Coin Explosion */}
                                {isLoading && coins.map((coin) => (
                                    <div
                                        key={coin.id}
                                        className="absolute left-1/2 top-1/2 animate-coin-explode"
                                        style={{
                                            '--tx': `${coin.vx * 30}px`,
                                            '--ty': `${coin.vy * 30}px`,
                                            '--rotation': `${coin.rotation}deg`,
                                            '--rotation-speed': `${coin.rotationSpeed}deg`
                                        } as React.CSSProperties}
                                    >
                                        <BitcoinIcon />
                                    </div>
                                ))}

                                <span className="relative z-10">
                                    {isLoading ? 'Processing...' : 'Sign In'}
                                </span>
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    className="text-white/60 hover:text-white text-sm transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}