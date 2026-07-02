import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import VideoCard from "../components/VideoCard";
import { DEFAULT_PROFILE_IMAGE } from "../constants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [videos, setVideos] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("videos");

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }
        fetchSearchResults();
    }, [query]);

    const fetchSearchResults = async () => {
        try {
            setLoading(true);

            // Get current user
            const token = localStorage.getItem("token");
            if (token) {
                const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();
                setCurrentUser(userData.user);
            }

            // Search videos
            const videosRes = await fetch(
                `${API_BASE_URL}/api/videos/search?query=${encodeURIComponent(query)}`
            );
            const videosData = await videosRes.json();
            setVideos(videosData.videos || []);

            // Search users
            const usersRes = await fetch(
                `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(query)}`
            );
            const usersData = await usersRes.json();
            setUsers(usersData.users || []);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!query) {
        return (
            <>
                <Navbar />
                <div className="max-w-4xl mx-auto p-4 mt-20 text-center">
                    <p className="text-gray-400 text-lg">Enter a search query to get started</p>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="text-center mt-20">Loading...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 mt-8">
                <h1 className="text-3xl font-bold mb-6">
                    Search results for "<span className="text-[#FE2C55]">{query}</span>"
                </h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab("videos")}
                        className={`pb-3 px-4 font-bold transition ${
                            activeTab === "videos"
                                ? "text-white border-b-2 border-[#FE2C55]"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Videos ({videos.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`pb-3 px-4 font-bold transition ${
                            activeTab === "users"
                                ? "text-white border-b-2 border-[#FE2C55]"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Users ({users.length})
                    </button>
                </div>

                {/* Videos Tab */}
                {activeTab === "videos" && (
                    <div>
                        {videos.length === 0 ? (
                            <p className="text-center text-gray-400">No videos found</p>
                        ) : (
                            <div className="space-y-6">
                                {videos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        video={video}
                                        currentUserId={currentUser?._id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div>
                        {users.length === 0 ? (
                            <p className="text-center text-gray-400">No users found</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {users.map((user) => (
                                    <Link
                                        key={user._id}
                                        to={`/profile/${user._id}`}
                                        className="bg-[#1E293B] rounded-lg p-4 hover:bg-[#2D3748] transition block"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image || DEFAULT_PROFILE_IMAGE}
                                                alt={user.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-xs text-gray-400">{user.name}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3 mb-3 line-clamp-2">
                                            {user.bio || "No bio"}
                                        </p>
                                        <div className="flex gap-2 text-xs text-gray-400">
                                            <span>{user.followers?.length || 0} followers</span>
                                            <span>{user.totalPosts || 0} videos</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Search;
