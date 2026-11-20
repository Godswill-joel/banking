'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    country: string;
    username: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
};

const initialForm: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    username: '',
    password: '',
    confirmPassword: '',
    agree: false,
};

const inputClass =
    'w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#C1A578]/60 focus:bg-white/[0.06] transition-all';
const labelClass = 'text-white/50 text-xs tracking-widest uppercase';

function firebaseMessage(code?: string, fallback?: string) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 8 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection and try again.';
        default:
            return fallback ?? 'Something went wrong. Please try again.';
    }
}

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
        setError('');
    };

    // Password strength: 0–4
    const strength = useMemo(() => {
        const p = formData.password;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
        if (/\d/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score;
    }, [formData.password]);

    const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength];

    const validateStep1 = () => {
        const { firstName, lastName, email, phone, dateOfBirth, country } = formData;
        if (!firstName || !lastName || !email || !phone || !dateOfBirth || !country) {
            return 'Please fill in all fields.';
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';

        const dob = new Date(dateOfBirth);
        const eighteen = new Date();
        eighteen.setFullYear(eighteen.getFullYear() - 18);
        if (dob > eighteen) return 'You must be at least 18 years old to invest.';
        return '';
    };

    const validateStep2 = () => {
        const { username, password, confirmPassword, agree } = formData;
        if (!username || !password || !confirmPassword) return 'Please fill in all fields.';
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
            return 'Username must be 3–20 characters: letters, numbers or underscores.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        if (!agree) return 'Please accept the Terms and Privacy Policy to continue.';
        return '';
    };

    const handleNext = () => {
        const msg = validateStep1();
        if (msg) return setError(msg);
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) return handleNext();

        const msg = validateStep2();
        if (msg) return setError(msg);

        setError('');
        setIsLoading(true);

        const username = formData.username.trim().toLowerCase();
        let createdUser: Awaited<ReturnType<typeof createUserWithEmailAndPassword>>['user'] | null = null;

        try {
            // 1. Create the auth account
            const cred = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
            createdUser = cred.user;

            // 2. Make sure the username is free (done after sign-in so Firestore rules can require auth)
            const taken = await getDocs(query(collection(db, 'users'), where('username', '==', username), limit(1)));
            if (!taken.empty) {
                await deleteUser(createdUser);
                setError('That username is already taken. Please choose another.');
                setIsLoading(false);
                return;
            }

            await updateProfile(createdUser, { displayName: `${formData.firstName} ${formData.lastName}` });

            // 3. Create the Firestore profile — role, balance and verification are fixed, never user-chosen
            await setDoc(doc(db, 'users', createdUser.uid), {
                uid: createdUser.uid,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                dateOfBirth: formData.dateOfBirth,
                country: formData.country,
                username,
                role: 'user',

                balance: 0,
                kycVerified: false,
                emailVerified: false,
                phoneVerified: false,

                profileImage: null,
                walletAddress: crypto.randomUUID(),

                createdAt: serverTimestamp(),
                lastLogin: null,
                lastFunded: null,
                transactions: [],
            });

            router.push('/dashboard');
        } catch (err: any) {
            // Roll back the auth user if the profile could not be saved
            if (createdUser) {
                try {
                    await deleteUser(createdUser);
                } catch {
                    /* ignore */
                }
            }
            setError(firebaseMessage(err?.code, err?.message));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">
            {/* ── Left panel — decorative ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 bg-[#0D0D0D]" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `
              linear-gradient(#C1A578 1px, transparent 1px),
              linear-gradient(90deg, #C1A578 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C1A578]/30 to-transparent" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-[#C1A578]/10" />
                <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full border border-[#C1A578]/8" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#C1A578]/5 blur-3xl" />

                <div className="relative z-10">
                    <div onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer w-fit">
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
                        Start building<br />
                        <span className="text-[#C1A578]">your portfolio.</span>
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                        Create your free account in two minutes. Choose a plan, fund your wallet and watch your
                        returns grow.
                    </p>

                    <ul className="space-y-3 pt-2">
                        {['Curated investment plans', 'Real-time portfolio tracking', 'Secure wallet & withdrawals'].map(
                            (item) => (
                                <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                                    <span className="w-5 h-5 rounded-full border border-[#C1A578]/40 flex items-center justify-center">
                                        <Check size={11} className="text-[#C1A578]" />
                                    </span>
                                    {item}
                                </li>
                            )
                        )}
                    </ul>
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C1A578]/5 blur-3xl rounded-full pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <div
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 mb-10 lg:hidden cursor-pointer w-fit"
                    >
                        <ArrowLeft className="text-[#C1A578] w-5 h-5" />
                        <div>
                            <p className="text-[#C1A578] font-semibold text-lg tracking-wide">Back</p>
                            <p className="text-white/30 text-xs tracking-widest uppercase">Back to Platform</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-3">Step {step} of 2</p>
                        <h1 className="text-3xl font-light text-white">
                            Create your<br />
                            <span className="text-[#C1A578]">account</span>
                        </h1>
                        {/* Progress */}
                        <div className="flex gap-2 mt-6">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                        step >= s ? 'bg-[#C1A578]' : 'bg-white/10'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={labelClass}>First name</label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            autoComplete="given-name"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Last name</label>
                                        <input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            autoComplete="family-name"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Phone number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+234 800 000 0000"
                                        autoComplete="tel"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Date of birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className={`${inputClass} [color-scheme:dark]`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Country</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={`${inputClass} appearance-none [color-scheme:dark]`}
                                        >
                                            <option value="" className="bg-[#0D0D0D]">Select</option>
                                            <option value="NG" className="bg-[#0D0D0D]">Nigeria</option>
                                            <option value="US" className="bg-[#0D0D0D]">United States</option>
                                            <option value="UK" className="bg-[#0D0D0D]">United Kingdom</option>
                                            <option value="CA" className="bg-[#0D0D0D]">Canada</option>
                                            <option value="AU" className="bg-[#0D0D0D]">Australia</option>
                                            <option value="OTHER" className="bg-[#0D0D0D]">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="space-y-2">
                                    <label className={labelClass}>Username</label>
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Choose a username"
                                        autoComplete="username"
                                        className={inputClass}
                                    />
                                    <p className="text-white/25 text-xs">You will use this to sign in.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="At least 8 characters"
                                            autoComplete="new-password"
                                            className={`${inputClass} pr-12`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#C1A578] transition-colors"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {formData.password && (
                                        <div className="flex items-center gap-3 pt-1">
                                            <div className="flex gap-1.5 flex-1">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all ${
                                                            strength >= i
                                                                ? strength <= 1
                                                                    ? 'bg-red-400'
                                                                    : strength === 2
                                                                    ? 'bg-yellow-400'
                                                                    : 'bg-[#C1A578]'
                                                                : 'bg-white/10'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-white/40 text-xs w-16 text-right">{strengthLabel}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Confirm password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        className={inputClass}
                                    />
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-red-400/80 text-xs">Passwords do not match.</p>
                                    )}
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        name="agree"
                                        checked={formData.agree}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded border border-white/20 bg-white/[0.04] flex items-center justify-center peer-checked:bg-[#C1A578] peer-checked:border-[#C1A578] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C1A578]/50 transition-all">
                                        {formData.agree && <Check size={11} className="text-black" />}
                                    </span>
                                    <span className="text-white/40 text-xs leading-relaxed">
                                        I agree to the{' '}
                                        <a href="/terms" className="text-[#C1A578]/80 hover:text-[#C1A578]">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" className="text-[#C1A578]/80 hover:text-[#C1A578]">
                                            Privacy Policy
                                        </a>
                                        , and I am at least 18 years old.
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        setStep(1);
                                    }}
                                    disabled={isLoading}
                                    className="px-6 py-4 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-60"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-medium text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-[#C1A578] hover:bg-[#D4B98A] text-black shadow-lg shadow-[#C1A578]/20 hover:shadow-[#C1A578]/30"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : step === 1 ? (
                                    <>
                                        <span>Continue</span>
                                        <ArrowRight size={16} />
                                    </>
                                ) : (
                                    <>
                                        <span>Create account</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-white/40 text-sm mt-8">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/user-login')}
                            className="text-[#C1A578] hover:text-[#D4B98A] transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}