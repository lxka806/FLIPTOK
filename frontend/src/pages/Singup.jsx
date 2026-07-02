import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaCamera } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Signup() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!username.trim() || !name.trim() || !email.trim() || !password.trim()) {
            setError("Please fill out all mandatory fields.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("username", username.trim());
            formData.append("name", name.trim());
            formData.append("email", email.trim());
            formData.append("password", password);
            formData.append("bio", bio.trim());

            if (image) {
                formData.append("image", image);
            }

            const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup process failed.");
            }

            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            if (imagePreview) URL.revokeObjectURL(imagePreview);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col relative overflow-y-auto select-none pb-12">
            <NavBar />

            {/* BACKGROUND DECORATIVE GLOW AURA */}
            <div className="absolute w-96 h-96 bg-[#25F4EE]/10 blur-[150px] rounded-full top-10 left-[-5%] pointer-events-none" />
            <div className="absolute w-96 h-96 bg-[#FE2C55]/10 blur-[150px] rounded-full bottom-10 right-[-5%] pointer-events-none" />

            <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                <div className="w-full max-w-xl bg-[#1E293B]/60 backdrop-blur-xl border border-[#334155] rounded-2xl shadow-2xl p-6 md:p-8">
                    
                    {/* Header Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#FE2C55] via-purple-400 to-[#25F4EE] bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-xs text-gray-400 mt-1.5 font-light">
                            Join the community and share your moments.
                        </p>
                    </div>

                    {/* Error Banner Container */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        
                        {/* INTERACTIVE PROFILE AVATAR PICKER */}
                        <div className="flex flex-col items-center justify-center mb-4">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 bg-[#0F172A] border-2 border-dashed border-[#475569] hover:border-[#25F4EE] rounded-full relative overflow-hidden flex items-center justify-center cursor-pointer group transition-all"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center flex flex-col items-center justify-center text-gray-500 group-hover:text-[#25F4EE] transition">
                                        <FaCamera className="text-xl mb-1" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Avatar</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition duration-150">
                                    Change
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                className="hidden" 
                            />
                        </div>

                        {/* INPUT FIELDS ROW MATRIX */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Username Field */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Username *</label>
                                <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3 py-2 transition group">
                                    <FaUser className="text-gray-500 group-focus-within:text-[#25F4EE] text-xs mr-2 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-600"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Full Name Field */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Display Name *</label>
                                <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3 py-2 transition group">
                                    <FaIdCard className="text-gray-500 group-focus-within:text-[#25F4EE] text-xs mr-2 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-600"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Address Input */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Email Address *</label>
                            <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3.5 py-2.5 transition group">
                                <FaEnvelope className="text-gray-500 group-focus-within:text-[#25F4EE] text-xs mr-3 shrink-0" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-600"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Secure Password *</label>
                            <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3.5 py-2.5 transition group">
                                <FaLock className="text-gray-500 group-focus-within:text-[#FE2C55] text-xs mr-3 shrink-0" />
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-600"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Biography Text Area */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Short Bio</label>
                            <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl p-3 transition">
                                <textarea
                                    placeholder="Tell the community about yourself..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-600 h-16 resize-none"
                                    maxLength={160}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Actions Module */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] disabled:bg-[#475569] text-white text-xs font-bold shadow-lg shadow-[#FE2C55]/10 transition active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    {/* Footer Auth Switch Redirection Link */}
                    <div className="text-center mt-5 pt-4 border-t border-[#334155]/60">
                        <p className="text-xs text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#25F4EE] font-medium hover:underline ml-1">
                                Log in
                            </Link>
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Signup;