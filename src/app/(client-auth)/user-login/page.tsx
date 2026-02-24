'use client';

import React, { useState } from 'react';
import { loginUserWithRole } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';


export default function LoginPage() {
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

        const res = await loginUserWithRole(formData.username, formData.password);
        setIsLoading(false);

        if (!res.success) {
            setError(res.message ?? 'Login failed. Please try again.');
        } else if (!res.allowed) {
            setError(res.message ?? "You don't have permission to access this panel.");
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">

            {/* ── Left panel — decorative ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                {/* Background texture */}
                <div className="absolute inset-0 bg-[#0D0D0D]" />
                {/* Gold geometric lines */}
                <div className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `
              linear-gradient(#C1A578 1px, transparent 1px),
              linear-gradient(90deg, #C1A578 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Diagonal gold accent */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C1A578]/30 to-transparent" />
                {/* Large decorative circle */}
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-[#C1A578]/10" />
                <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full border border-[#C1A578]/8" />
                {/* Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#C1A578]/5 blur-3xl" />

                {/* Content */}
                <div className="relative z-10">
                    <div
                        onClick={() => { router.push('/') }}
                        className="flex items-center gap-3">
                        <ArrowLeft className="text-[#C1A578] w-5 h-5" />
                        <div>
                            <p className="text-[#C1A578] font-semibold text-lg tracking-wide">Back</p>
                            <p className="text-white/30 text-xs tracking-widest uppercase">Back to Platform</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="w-10 h-px bg-[#C1A578]" />
                    <h2 className="text-4xl font-light text-white leading-snug">
                        Grow your wealth<br />
                        <span className="text-[#C1A578]">with confidence.</span>
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                        Invest in curated plans, track your portfolio in real time, and earn passive income — all in one secure platform.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-8">
                    {[
                        { label: 'Active Investors', value: '12K+' },
                        { label: 'Uptime', value: '99.9%' },
                        { label: 'Avg. Monthly ROI', value: '12%' },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-[#C1A578] text-xl font-semibold">{value}</p>
                            <p className="text-white/30 text-xs mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative">
                {/* Subtle top-right glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C1A578]/5 blur-3xl rounded-full pointer-events-none" />

                <div className="w-full max-w-md relative z-10">


                    <div
                        onClick={() => { router.push('/') }}
                        className="flex items-center gap-3 mb-10 lg:hidden">
                        <ArrowLeft className="text-[#C1A578] w-5 h-5" />
                        <div>
                            <p className="text-[#C1A578] font-semibold text-lg tracking-wide">Back</p>
                            <p className="text-white/30 text-xs tracking-widest uppercase">Back to Platform</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3">Welcome back</p>
                        <h1 className="text-3xl font-light text-white">Sign in to your<br /><span className="text-[#C1A578]">account</span></h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs tracking-widest uppercase">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setError(''); }}
                                    placeholder="Enter your username"
                                    className="w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#C1A578]/60 focus:bg-white/[0.06] transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-white/50 text-xs tracking-widest uppercase">Password</label>
                                <button type="button" className="text-[#C1A578]/70 hover:text-[#C1A578] text-xs transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
                                    placeholder="Enter your password"
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
                            className="w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-xl font-medium text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed
                bg-[#C1A578] hover:bg-[#D4B98A] text-black shadow-lg shadow-[#C1A578]/20 hover:shadow-[#C1A578]/30"
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
                        <span className="text-white/20 text-xs">secure login</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6">
                        {['256-bit SSL', 'End-to-end encrypted', '2FA ready'].map((label) => (
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