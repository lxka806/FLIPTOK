import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit
        if (!email.trim() || !password.trim()) {
            setError("Please fill out all credentials.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid email or password.");
            }

            // Secure local tracking storage items
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col relative overflow-hidden select-none">
            <NavBar />

            {/* BACKGROUND BLUR HIGHLIGHT GLOWS */}
            <div className="absolute w-80 h-80 bg-[#FE2C55]/10 blur-[130px] rounded-full top-1/4 left-[-10%] pointer-events-none" />
            <div className="absolute w-80 h-80 bg-[#25F4EE]/10 blur-[130px] rounded-full bottom-1/4 right-[-10%] pointer-events-none" />

            {/* AUTH CORE FORM CONTAINER */}
            <main className="flex-1 flex items-center justify-center px-4 relative z-10">
                <div className="w-full max-w-md bg-[#1E293B]/60 backdrop-blur-xl border border-[#334155] rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300">
                    
                    {/* Header Branding Panel */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#FE2C55] via-purple-400 to-[#25F4EE] bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-gray-400 mt-2 font-light">
                            Log in to access your custom feed and creators.
                        </p>
                    </div>

                    {/* Inline Error Dynamic Message Banner */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Authentication Form Element */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        
                        {/* Email Input Field Row */}
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                                Email Address
                            </label>
                            <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3.5 py-2.5 transition group">
                                <FaEnvelope className="text-gray-500 group-focus-within:text-[#25F4EE] transition text-sm mr-3 shrink-0" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-600"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input Field Row */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                    Password
                                </label>
                            </div>
                            <div className="relative flex items-center bg-[#0F172A] border border-[#334155] focus-within:border-gray-500 rounded-xl px-3.5 py-2.5 transition group">
                                <FaLock className="text-gray-500 group-focus-within:text-[#FE2C55] transition text-sm mr-3 shrink-0" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-600"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Action Button Block */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] disabled:bg-[#475569] text-white text-sm font-bold shadow-lg shadow-[#FE2C55]/10 active:scale-[0.98] transition flex items-center justify-center gap-2 relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FaSignInAlt />
                                    <span>Log In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Navigational Redirection Info Anchor */}
                    <div className="text-center mt-6 pt-5 border-t border-[#334155]/60">
                        <p className="text-xs text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-[#25F4EE] font-medium hover:underline ml-1">
                                Sign up
                            </Link>
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Login;