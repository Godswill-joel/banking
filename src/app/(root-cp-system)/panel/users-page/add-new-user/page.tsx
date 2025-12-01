"use client";

import React, { useState } from "react";
import { auth, db } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import {
    User,
    Mail,
    Lock,
    Shield,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Upload,
    X,
    Check,
    ArrowLeft,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react";

export default function AddUserPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",


        username: "",
        password: "",
        confirmPassword: "",
        role: "user",


        address: "",
        city: "",
        country: "",
        zipCode: "",


        initialBalance: "",
        kycVerified: false,
        emailVerified: false,
        phoneVerified: false,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // 1️⃣ Create Firebase Auth User
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // 2️⃣ Update displayName
            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`
            });

            // 3️⃣ Build Firestore Document
            const userData = {
                uid: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,

                username: formData.username,
                role: formData.role,

                address: formData.address,
                city: formData.city,
                country: formData.country,
                zipCode: formData.zipCode,

                balance: Number(formData.initialBalance) || 0,
                kycVerified: formData.kycVerified,
                emailVerified: formData.emailVerified,
                phoneVerified: formData.phoneVerified,

                profileImage: selectedImage || null,
                walletAddress: crypto.randomUUID(), 

                createdAt: serverTimestamp(),
                lastLogin: null,
                lastFunded: null,
                transactions: [],
            };

            // 4️⃣ Save to Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            alert("User created successfully!");

        } catch (error: any) {
            console.error("Error creating user:", error);
            alert(error.message);
        }
    };


    const steps = [
        { number: 1, title: "Personal Info", icon: User },
        { number: 2, title: "Account Setup", icon: Shield },
        { number: 3, title: "Address Details", icon: MapPin },
        { number: 4, title: "Verification", icon: Check },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button className="p-3 hover:bg-white/80 rounded-xl transition-all backdrop-blur-sm border border-white/20">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                            Add New User
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                            Create a new user account with complete details
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {steps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center gap-2 z-10">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.number
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                        : "bg-white border-2 border-gray-300 text-gray-400"
                                        }`}
                                >
                                    {currentStep > step.number ? (
                                        <Check size={20} />
                                    ) : (
                                        <step.icon size={20} />
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm font-medium hidden md:block ${currentStep >= step.number ? "text-black" : "text-gray-400"
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Personal Information</h2>

                                {/* Profile Image Upload */}
                                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all">
                                    <div className="relative">
                                        {selectedImage ? (
                                            <div className="relative">
                                                <Image
                                                    src={selectedImage}
                                                    alt="Preview"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                                <button
                                                    onClick={() => setSelectedImage(null)}
                                                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                                <User size={48} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                                            <Upload size={20} />
                                            Upload Photo
                                        </div>
                                    </label>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            First Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Last Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="john.doe@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Account Setup */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Account Setup</h2>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Username *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="johndoe123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-11 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Confirm Password *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <AlertCircle size={20} className="text-red-500" />
                                        <span className="text-sm text-red-700">Passwords do not match</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        User Role *
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all appearance-none bg-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Initial Balance (Optional)
                                    </label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="number"
                                            name="initialBalance"
                                            value={formData.initialBalance}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Address Details</h2>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Street Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                                            placeholder="123 Main Street, Apt 4B"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="New York"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            ZIP / Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="10001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Country *
                                    </label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                        <option value="NG">Nigeria</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Verification */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Verification Status</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Mail className="text-blue-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">Email Verification</h3>
                                                <p className="text-sm text-gray-500">Verify user's email address</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="emailVerified"
                                                checked={formData.emailVerified}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                                <Phone className="text-green-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">Phone Verification</h3>
                                                <p className="text-sm text-gray-500">Verify user's phone number</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="phoneVerified"
                                                checked={formData.phoneVerified}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Shield className="text-purple-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">KYC Verification</h3>
                                                <p className="text-sm text-gray-500">Know Your Customer verification</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="kycVerified"
                                                checked={formData.kycVerified}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
                                    <h3 className="text-lg font-bold text-black mb-4">Review Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-semibold text-black">
                                                {formData.firstName} {formData.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-semibold text-black">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Username:</span>
                                            <span className="font-semibold text-black">{formData.username}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Role:</span>
                                            <span className="font-semibold text-black capitalize">{formData.role}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Initial Balance:</span>
                                            <span className="font-semibold text-black">
                                                ${formData.initialBalance || "0.00"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {currentStep > 1 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-white transition-all"
                                >
                                    Previous
                                </button>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Create User
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}