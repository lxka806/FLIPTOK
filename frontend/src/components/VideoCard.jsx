import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function VideoCard({ video, currentUserId }) {
    const [isLiked, setIsLiked] = useState(video.likes.includes(currentUserId));
    const [likeCount, setLikeCount] = useState(video.likes.length);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(video.comments || []);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const endpoint = isLiked ? "unlike" : "like";

            // Optimistic update for premium UX feel
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

            const res = await fetch(`${API_BASE_URL}/api/videos/${video._id}/${endpoint}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                // Rollback if request fails
                setIsLiked(isLiked);
                setLikeCount(video.likes.length);
            } else {
                const data = await res.json();
                setLikeCount(data.likes);
            }
        } catch (err) {
            console.error("Like error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || loading) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/api/videos/${video._id}/comment`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: commentText }),
            });

            if (res.ok) {
                const data = await res.json();
                setComments([...comments, data.comment]);
                setCommentText("");
            }
        } catch (err) {
            console.error("Comment error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-4rem)] md:h-auto md:max-w-[460px] md:mx-auto bg-black md:bg-[#0F172A] md:rounded-2xl md:shadow-2xl overflow-hidden md:my-6 border border-transparent md:border-[#1E293B] snap-start">
            
            {/* VIDEO FRAME PLAYER */}
            <div className="w-full h-full md:aspect-[9/16] bg-black flex items-center justify-center relative">
                <video
                    src={video.videoUrl}
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain md:object-cover"
                />

                {/* GRADIENT OVERLAY FOR CAPTIONS READABILITY */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

                {/* FLOATING ACTION HUD (TikTok Style on Mobile) */}
                <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-5 z-20">
                    {/* User Creator Profile Link Accent */}
                    <div className="relative mb-2">
                        <img
                            src={video.user.image}
                            alt={video.user.username}
                            className="w-12 h-12 rounded-full border-2 border-[#FE2C55] object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#FE2C55] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                            +
                        </div>
                    </div>

                    {/* Like Action Icon */}
                    <button 
                        onClick={handleLike} 
                        className="flex flex-col items-center group active:scale-95 transition"
                    >
                        <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl shadow-md group-hover:bg-black/60 transition">
                            {isLiked ? <FaHeart className="text-[#FE2C55] scale-110 transition-transform" /> : <FaRegHeart />}
                        </div>
                        <span className="text-white text-xs font-semibold shadow-sm mt-1">{likeCount}</span>
                    </button>

                    {/* Comments Controller Icon */}
                    <button 
                        onClick={() => setShowComments(true)} 
                        className="flex flex-col items-center group active:scale-95 transition"
                    >
                        <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl shadow-md group-hover:bg-black/60 transition">
                            <FaComment />
                        </div>
                        <span className="text-white text-xs font-semibold shadow-sm mt-1">{comments.length}</span>
                    </button>
                </div>

                {/* CAPTION & USER DESCRIPTION FOOTER BLOCK */}
                <div className="absolute left-4 bottom-4 right-20 text-white z-10 pointer-events-auto">
                    <h2 className="font-bold text-base tracking-wide flex items-center gap-1.5 mb-1">
                        @{video.user.username}
                        <span className="text-xs font-normal text-gray-400">• {video.user.name}</span>
                    </h2>
                    {video.caption && (
                        <p className="text-sm text-gray-100 font-light line-clamp-3 leading-relaxed">
                            {video.caption}
                        </p>
                    )}
                </div>
            </div>

            {/* SLIDE-UP NATIVE DRAWERS STYLE COMMENTS OVERLAY (Both Web & Mobile Responsive) */}
            {showComments && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 flex flex-col justify-end transition-opacity">
                    {/* Drawer Container */}
                    <div className="bg-[#0F172A] w-full h-[70%] md:h-[60%] rounded-t-2xl flex flex-col border-t border-[#1E293B] animate-slide-up">
                        
                        {/* Comments Drawer Header */}
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1E293B]">
                            <span className="font-bold text-[#F8FAFC] text-sm">{comments.length} Comments</span>
                            <button 
                                onClick={() => setShowComments(false)}
                                className="text-gray-400 hover:text-white text-xl p-1 bg-[#1E293B] rounded-full"
                            >
                                <IoClose />
                            </button>
                        </div>

                        {/* List Dynamic Renderer */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 custom-scrollbar">
                            {comments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                    💬 Be the first to start the conversation!
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-3 group items-start">
                                        <img
                                            src={comment.user.image}
                                            alt={comment.user.username}
                                            className="w-8 h-8 rounded-full object-cover border border-[#1E293B]"
                                        />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-400 mb-0.5">
                                                @{comment.user.username}
                                            </p>
                                            <p className="text-sm text-[#F8FAFC] font-light leading-snug">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Sticky Action Footer Input Box */}
                        <form onSubmit={handleAddComment} className="p-3 border-t border-[#1E293B] bg-[#0F172A] pb-safe">
                            <div className="flex items-center bg-[#1E293B] rounded-full px-4 py-2 border border-transparent focus-within:border-gray-600 transition">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add constructive comment..."
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !commentText.trim()}
                                    className="text-[#FE2C55] hover:text-white disabled:text-gray-600 transition p-1 pl-2"
                                >
                                    <FaPaperPlane className="text-base" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoCard;