'use client';

import React, { useState } from 'react';
import { loginUser } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Lock } from 'lucide-react';


export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');
        setIsLoading(true);

        const res = await loginUser(formData.username, formData.password);
        setIsLoading(false);

        if (!res.success) {
            setError(res.message ?? 'Login failed. Please check your credentials.');
        } else {
            router.push('/panel');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">
          
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-[#0D0D0D]" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
              linear-gradient(#C1A578 1px, transparent 1px),
              linear-gradient(90deg, #C1A578 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />              
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C1A578]/30 to-transparent" />
                <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border border-[#C1A578]/8" />
                <div className="absolute -top-12 -right-12 w-[280px] h-[280px] rounded-full border border-[#C1A578]/10" />

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C1A578]/4 blur-3xl rounded-full" />

                {/* Top content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <Lock />
                        <div>
                            <p className="text-[#C1A578] font-semibold text-lg tracking-wide">River Admin</p>
                            <p className="text-white/30 text-xs tracking-widest uppercase">Control Panel</p>
                        </div>
                    </div>
                </div>

                {/* Middle content */}
                <div className="relative z-10 space-y-6">
                    <div className="w-10 h-px bg-[#C1A578]" />
                    <h2 className="text-4xl font-light text-white leading-snug">
                        Manage with<br />
                        <span className="text-[#C1A578]">full control.</span>
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                        Access your admin panel to manage users, investments, withdrawals, and platform settings — all from one place.
                    </p>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 p-4 bg-white/[0.03] border border-white/8 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-[#C1A578]/10 border border-[#C1A578]/20 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck size={15} className="text-[#C1A578]" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs font-medium">Restricted Access</p>
                            <p className="text-white/30 text-xs">Authorized personnel only. All activity is logged.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C1A578]/4 blur-3xl rounded-full pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <Lock />
                        <div>
                            <p className="text-[#C1A578] font-semibold text-lg tracking-wide">River Admin</p>
                            <p className="text-white/30 text-xs tracking-widest uppercase">Control Panel</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3">Admin access</p>
                        <h1 className="text-3xl font-light text-white">
                            Sign in to the<br />
                            <span className="text-[#C1A578]">admin panel</span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email / Username */}
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs tracking-widest uppercase">
                                Email / Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setError(''); }}
                                placeholder="admin@river.com"
                                autoComplete="username"
                                className="w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#C1A578]/60 focus:bg-white/[0.06] transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs tracking-widest uppercase">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-[#C1A578]/60 focus:bg-white/[0.06] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#C1A578] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-xl font-medium text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-[#C1A578] hover:bg-[#D4B98A] text-black shadow-lg shadow-[#C1A578]/20 hover:shadow-[#C1A578]/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mt-8 mb-6">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-white/20 text-xs">secured access</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6">
                        {['Role-based access', 'Activity logged', '256-bit SSL'].map((label) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-[#C1A578]/60" />
                                <span className="text-white/25 text-xs">{label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
}