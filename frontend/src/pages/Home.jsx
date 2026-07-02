import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import VideoCard from "../components/VideoCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Home() {
    const [videos, setVideos] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            // Parallel execution speeds up initial feed loads
            const [userRes, videosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE_URL}/api/videos/all`)
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setCurrentUser(userData.user);
            }

            if (videosRes.ok) {
                const videosData = await videosRes.json();
                setVideos(videosData.videos);
            }
        } catch (err) {
            console.error("Error fetching feed data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <div className="w-8 h-8 border-4 border-t-[#FE2C55] border-gray-700 rounded-full animate-spin" />
                    <p className="text-sm font-medium tracking-wide">Assembling your feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black md:bg-[#0F172A] flex flex-col overflow-hidden">
            <Navbar />
            
            {/* MAIN VIDEO TRACK CONTAINER */}
            {/* snap-y snap-mandatory enables vertical swiping mechanics on touch devices */}
            <main className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth custom-scrollbar pb-16 md:pb-0">
                {videos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center text-gray-500">
                        <span className="text-4xl mb-2">🎬</span>
                        <p className="text-sm font-medium">No videos yet.</p>
                        <p className="text-xs text-gray-600 mt-1">Be the first to upload your creation to the feed!</p>
                    </div>
                ) : (
                    <div className="w-full h-full">
                        {videos.map((video) => (
                            <VideoCard
                                key={video._id}
                                video={video}
                                currentUserId={currentUser?._id}
                                onVideoUpdate={fetchData}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;