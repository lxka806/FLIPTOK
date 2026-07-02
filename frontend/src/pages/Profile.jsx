import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FaHeart } from "react-icons/fa";
import { LuGrid3X3 } from "react-icons/lu";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Profile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userVideos, setUserVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setError("No login token discovered. Access denied.");
                    return;
                }

                // If userId is provided in URL, fetch that user's profile
                // Otherwise fetch current user's profile
                let userUrl = `${API_BASE_URL}/api/users/me`;
                if (userId) {
                    userUrl = `${API_BASE_URL}/api/users/${userId}`;
                }

                const res = await fetch(userUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error(`Server returned exit status: ${res.status}`);
                const data = await res.json();
                const profileUser = data.user || data;
                setUser(profileUser);

                const videosRes = await fetch(`${API_BASE_URL}/api/videos/user/${profileUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (videosRes.ok) {
                    const videosData = await videosRes.json();
                    setUserVideos(videosData.videos);
                }
            } catch (err) {
                console.error("Profile error layout link crash:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-32 gap-3 text-gray-400">
                    <div className="w-8 h-8 border-4 border-t-[#25F4EE] border-gray-800 rounded-full animate-spin" />
                    <p className="text-xs">Syncing profile elements...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white">
                <Navbar />
                <div className="text-center pt-20 text-red-400 font-mono text-xs">⚠️ Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
            <Navbar />

            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                {/* PROFILE HEADER */}
                <header className="text-center mb-12 py-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] rounded-full opacity-50 blur-lg" />
                            <img
                                src={user.image || "https://via.placeholder.com/150"}
                                alt={user.name}
                                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#0F172A]"
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold mb-2">{user.username}</h1>
                    <p className="text-sm md:text-base text-gray-400 mb-2">{user.name}</p>
                    <p className="text-xs md:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                        {user.bio || "This creator hasn't written a biography yet."}
                    </p>

                    {/* STATS */}
                    <div className="flex justify-center gap-8 md:gap-12 mt-6 pt-6 border-t border-[#1E293B]">
                        <div className="text-center">
                            <p className="text-lg md:text-2xl font-bold text-white">{userVideos.length}</p>
                            <p className="text-xs md:text-sm text-[#94A3B8]">Videos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg md:text-2xl font-bold text-white">{user.followers?.length || 0}</p>
                            <p className="text-xs md:text-sm text-[#94A3B8]">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg md:text-2xl font-bold text-white">{user.following?.length || 0}</p>
                            <p className="text-xs md:text-sm text-[#94A3B8]">Following</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg md:text-2xl font-bold text-white">{user.totalLikes}</p>
                            <p className="text-xs md:text-sm text-[#94A3B8]">Likes</p>
                        </div>
                    </div>
                </header>

                {/* VIDEOS SECTION */}
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                        <LuGrid3X3 /> My Videos
                    </h2>

                    {userVideos.length === 0 ? (
                        <div className="text-center py-16 bg-[#1E293B]/30 rounded-lg border border-dashed border-[#334155]">
                            <p className="text-sm md:text-base text-gray-400 font-medium">No videos yet</p>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">Upload your first video to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                            {userVideos.map((video) => (
                                <div
                                    key={video._id}
                                    className="aspect-[9/16] bg-[#1E293B] rounded-lg overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-200 border border-[#334155]/30 hover:border-[#FE2C55]"
                                >
                                    {/* Video Preview */}
                                    <video
                                        src={video.videoUrl}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-3">
                                        <div className="flex items-center gap-1 text-[#FE2C55] font-bold text-sm md:text-base">
                                            <FaHeart /> {video.likes?.length || 0}
                                        </div>
                                        {video.caption && (
                                            <p className="text-white text-xs mt-2 text-center line-clamp-2">
                                                {video.caption}
                                            </p>
                                        )}
                                    </div>

                                    {/* Like Count Badge */}
                                    <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1 text-[#FE2C55] font-bold text-xs">
                                        <FaHeart /> {video.likes?.length || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;