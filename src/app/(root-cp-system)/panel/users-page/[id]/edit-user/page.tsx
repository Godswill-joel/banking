"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
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
    Save,
    Ban,
    AlertTriangle,
    Activity,
    DollarSign,
    TrendingUp,
    Wallet,
    Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function UserProfileEdit() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id;
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState<any>({});

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);
                    setEditedData(data);
                    setSelectedImage(data.profileImage || null);
                } else {
                    console.error("User not found");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setSelectedImage(imageUrl);
                setEditedData({
                    ...editedData,
                    profileImage: imageUrl
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSave = async () => {
        if (!userId || !editedData) return;
        
        try {
            setIsSaving(true);
            const userRef = doc(db, "users", userId);
            
            // Prepare update data
            const updateData = {
                ...editedData,
                updatedAt: new Date()
            };
            
            await updateDoc(userRef, updateData);
            
            alert("Profile updated successfully!");
            router.back(); // Go back to previous page
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const steps = [
        { number: 1, title: "Personal Info", icon: User },
        { number: 2, title: "Account Details", icon: Shield },
        { number: 3, title: "Address & Balance", icon: MapPin },
        { number: 4, title: "Verification", icon: Check },
    ];

    if (loading) {
        return <div className="text-center py-20">Loading user data...</div>;
    }

    if (!userData) {
        return <div className="text-center py-20 text-red-600">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-3 hover:bg-white/80 rounded-xl transition-all backdrop-blur-sm border border-white/20"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                Edit User Profile
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                Update user account details
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="hidden md:flex gap-3">
                            <button className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all">
                                <Ban size={20} />
                            </button>
                            <button className="p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-all">
                                <AlertTriangle size={20} />
                            </button>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
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
                                <button
                                    onClick={() => setCurrentStep(step.number)}
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
                                </button>
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
                                                    width={128}
                                                    height={128}
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setSelectedImage(null);
                                                        setEditedData({...editedData, profileImage: null});
                                                    }}
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
                                            {selectedImage ? "Change Photo" : "Upload Photo"}
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
                                                value={editedData.firstName || ""}
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
                                                value={editedData.lastName || ""}
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
                                                value={editedData.email || ""}
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
                                                value={editedData.phone || ""}
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
                                            value={editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString().split('T')[0] : ""}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Account Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Account Details</h2>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Username *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={editedData.username || ""}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="johndoe123"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Reset Section */}
                                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                    <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                                        <Lock size={20} />
                                        Password Reset
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Leave password fields empty to keep current password
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={editedData.newPassword || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-11 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                    placeholder="••••••••"
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
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={editedData.confirmPassword || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {editedData.newPassword && editedData.confirmPassword && editedData.newPassword !== editedData.confirmPassword && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mt-4">
                                            <AlertCircle size={20} className="text-red-500" />
                                            <span className="text-sm text-red-700">Passwords do not match</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        User Role *
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <select
                                            name="role"
                                            value={editedData.role || "user"}
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
                                        Wallet Address
                                    </label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="walletAddress"
                                            value={editedData.walletAddress || ""}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="0x..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address & Balance */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-bold text-black mb-6">Address & Balance</h2>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Street Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <textarea
                                            name="address"
                                            value={editedData.address || ""}
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
                                            value={editedData.city || ""}
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
                                            value={editedData.zipCode || ""}
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
                                        value={editedData.country || ""}
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Account Balance
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="number"
                                            name="balance"
                                            value={editedData.balance || 0}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Last Funded
                                    </label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="lastFunded"
                                            value={editedData.lastFunded || ""}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 text-black rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                                            placeholder="Never funded"
                                        />
                                    </div>
                                </div>

                                {/* Read-only Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Clock size={18} className="text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium">
                                                Account Created
                                            </p>
                                            <p className="text-sm text-black">
                                                {editedData.createdAt?.toDate
                                                    ? editedData.createdAt.toDate().toLocaleDateString()
                                                    : new Date(editedData.createdAt?.seconds * 1000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Activity size={18} className="text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium">
                                                Last Login
                                            </p>
                                            <p className="text-sm text-black">
                                                {editedData.lastLogin?.toDate
                                                    ? editedData.lastLogin.toDate().toLocaleDateString()
                                                    : editedData.lastLogin ? new Date(editedData.lastLogin.seconds * 1000).toLocaleDateString() : "Never"}
                                            </p>
                                        </div>
                                    </div>
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
                                                checked={editedData.emailVerified || false}
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
                                                checked={editedData.phoneVerified || false}
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
                                                checked={editedData.kycVerified || false}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
                                    <h3 className="text-lg font-bold text-black mb-4">Profile Summary</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-semibold text-black">
                                                {editedData.firstName} {editedData.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-semibold text-black">{editedData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Username:</span>
                                            <span className="font-semibold text-black">{editedData.username}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Role:</span>
                                            <span className="font-semibold text-black capitalize">{editedData.role}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Balance:</span>
                                            <span className="font-semibold text-black">
                                                ${editedData.balance?.toLocaleString() || "0.00"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
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
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    Save All Changes
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