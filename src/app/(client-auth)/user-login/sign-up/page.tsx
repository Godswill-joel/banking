'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { auth, db } from '@/firebase/config';

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

const INITIAL_FORM: FormData = {
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

// 16px minimum on mobile prevents iOS Safari from zooming when an input is focused.
const INPUT_CLASS =
  'w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/30 transition-colors focus:border-[#C1A578]/60 focus:bg-white/[0.06] focus:outline-none sm:text-sm';

const LABEL_CLASS = 'text-xs uppercase tracking-widest text-white/50';

const COUNTRIES = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'OTHER', label: 'Other' },
];

function getFirebaseErrorMessage(code?: string, fallback?: string) {
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

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    return [
      password.length >= 8,
      /[A-Z]/.test(password) && /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
  }, [formData.password]);

  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][
    passwordStrength
  ];

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target;
    const nextValue =
      type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
    setError('');
  }

  function validateStepOne() {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      country,
    } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !dateOfBirth ||
      !country
    ) {
      return 'Please fill in all fields.';
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    const dateOfBirthValue = new Date(`${dateOfBirth}T00:00:00`);
    const minimumAgeDate = new Date();
    minimumAgeDate.setFullYear(minimumAgeDate.getFullYear() - 18);

    if (
      Number.isNaN(dateOfBirthValue.getTime()) ||
      dateOfBirthValue > minimumAgeDate
    ) {
      return 'You must be at least 18 years old to invest.';
    }

    return '';
  }

  function validateStepTwo() {
    const { username, password, confirmPassword, agree } = formData;

    if (!username.trim() || !password || !confirmPassword) {
      return 'Please fill in all fields.';
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      return 'Username must be 3–20 characters: letters, numbers or underscores.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    if (!agree) {
      return 'Please accept the Terms and Privacy Policy to continue.';
    }

    return '';
  }

  function handleNext() {
    const validationError = validateStepOne();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setStep(2);
  }

  function handleBack() {
    setError('');
    setStep(1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      handleNext();
      return;
    }

    const validationError = validateStepTwo();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    const username = formData.username.trim().toLowerCase();
    let createdUser: Awaited<
      ReturnType<typeof createUserWithEmailAndPassword>
    >['user'] | null = null;

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password,
      );

      createdUser = credential.user;

      // Check availability after authentication so Firestore rules can require auth.
      const usernameQuery = query(
        collection(db, 'users'),
        where('username', '==', username),
        limit(1),
      );
      const existingUsername = await getDocs(usernameQuery);

      if (!existingUsername.empty) {
        await deleteUser(createdUser);
        createdUser = null;
        setError('That username is already taken. Please choose another.');
        return;
      }

      await updateProfile(createdUser, {
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      });

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
    } catch (submissionError: unknown) {
      // Roll back the Auth account if profile creation fails.
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch {
          // Preserve the original error if rollback is unsuccessful.
        }
      }

      const firebaseError = submissionError as {
        code?: string;
        message?: string;
      };

      setError(
        getFirebaseErrorMessage(
          firebaseError.code,
          firebaseError.message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full flex-col bg-[#0A0A0A] lg:flex-row">
      {/* Decorative desktop panel */}
      <aside className="relative hidden min-h-dvh w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0 bg-[#0D0D0D]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#C1A578 1px, transparent 1px), linear-gradient(90deg, #C1A578 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#C1A578]/30 to-transparent" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full border border-[#C1A578]/10" />
        <div className="absolute -bottom-20 -left-20 h-[360px] w-[360px] rounded-full border border-[#C1A578]/10" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C1A578]/5 blur-3xl" />

        <button
          type="button"
          onClick={() => router.push('/')}
          className="relative z-10 flex w-fit items-center gap-3 text-left"
        >
          <ArrowLeft className="h-5 w-5 text-[#C1A578]" />
          <span>
            <span className="block text-lg font-semibold tracking-wide text-[#C1A578]">
              Back
            </span>
            <span className="block text-xs uppercase tracking-widest text-white/30">
              Back to Platform
            </span>
          </span>
        </button>

        <div className="relative z-10 space-y-6">
          <div className="h-px w-10 bg-[#C1A578]" />
          <h2 className="text-4xl font-light leading-snug text-white">
            Start building
            <br />
            <span className="text-[#C1A578]">your portfolio.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            Create your free account in two minutes. Choose a plan, fund your
            wallet and watch your returns grow.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              'Curated investment plans',
              'Real-time portfolio tracking',
              'Secure wallet & withdrawals',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-white/50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C1A578]/40">
                  <Check size={11} className="text-[#C1A578]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-8">
          {[
            { label: 'Active Investors', value: '12K+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Avg. Monthly ROI', value: '12%' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xl font-semibold text-[#C1A578]">{value}</p>
              <p className="mt-0.5 text-xs text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Registration form */}
      <section className="relative flex min-h-dvh w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#C1A578]/5 blur-3xl"
        />

        <div className="relative z-10 w-full max-w-md">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-8 flex w-fit items-center gap-3 text-left lg:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-[#C1A578]" />
            <span>
              <span className="block text-lg font-semibold tracking-wide text-[#C1A578]">
                Back
              </span>
              <span className="block text-xs uppercase tracking-widest text-white/30">
                Back to Platform
              </span>
            </span>
          </button>

          <header className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/30">
              Step {step} of 2
            </p>
            <h1 className="text-3xl font-light text-white">
              Create your
              <br />
              <span className="text-[#C1A578]">account</span>
            </h1>

            <div
              className="mt-6 flex gap-2"
              aria-label={`Registration progress: step ${step} of 2`}
            >
              {[1, 2].map((currentStep) => (
                <div
                  key={currentStep}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= currentStep ? 'bg-[#C1A578]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 space-y-2">
                    <label className={LABEL_CLASS} htmlFor="firstName">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      autoComplete="given-name"
                      className={INPUT_CLASS}
                      required
                    />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label className={LABEL_CLASS} htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      autoComplete="family-name"
                      className={INPUT_CLASS}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={LABEL_CLASS} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={INPUT_CLASS}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className={LABEL_CLASS} htmlFor="phone">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    autoComplete="tel"
                    className={INPUT_CLASS}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 space-y-2">
                    <label className={LABEL_CLASS} htmlFor="dateOfBirth">
                      Date of birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`${INPUT_CLASS} [color-scheme:dark]`}
                      required
                    />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label className={LABEL_CLASS} htmlFor="country">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`${INPUT_CLASS} appearance-none [color-scheme:dark]`}
                      required
                    >
                      <option value="" className="bg-[#0D0D0D]">
                        Select country
                      </option>
                      {COUNTRIES.map((country) => (
                        <option
                          key={country.value}
                          value={country.value}
                          className="bg-[#0D0D0D]"
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className={LABEL_CLASS} htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    autoComplete="username"
                    className={INPUT_CLASS}
                    required
                  />
                  <p className="text-xs text-white/30">
                    You will use this to sign in.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className={LABEL_CLASS} htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className={`${INPUT_CLASS} pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-[#C1A578]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex flex-1 gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              passwordStrength >= level
                                ? passwordStrength <= 1
                                  ? 'bg-red-400'
                                  : passwordStrength === 2
                                    ? 'bg-yellow-400'
                                    : 'bg-[#C1A578]'
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="w-16 text-right text-xs text-white/40">
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={LABEL_CLASS} htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={INPUT_CLASS}
                    required
                  />
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400/80">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="peer sr-only"
                    required
                  />
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-white/[0.04] transition-colors peer-checked:border-[#C1A578] peer-checked:bg-[#C1A578] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C1A578]/50">
                    {formData.agree && <Check size={11} className="text-black" />}
                  </span>
                  <span className="text-xs leading-relaxed text-white/50">
                    I agree to the{' '}
                    <a
                      href="/terms"
                      className="text-[#C1A578]/90 hover:text-[#C1A578]"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="/privacy"
                      className="text-[#C1A578]/90 hover:text-[#C1A578]"
                    >
                      Privacy Policy
                    </a>
                    , and I am at least 18 years old.
                  </span>
                </label>
              </>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <p className="text-sm leading-relaxed text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="rounded-xl border border-white/10 px-5 py-4 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-60"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-[#C1A578] py-4 text-sm font-medium tracking-wide text-black shadow-lg shadow-[#C1A578]/20 transition-colors hover:bg-[#D4B98A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {step === 1 ? 'Continue' : 'Create account'}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/user-login')}
              className="text-[#C1A578] transition-colors hover:text-[#D4B98A]"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}