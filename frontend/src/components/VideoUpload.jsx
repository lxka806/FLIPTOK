import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFilm, FaHashtag } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function VideoUpload({ onUploadSuccess }) {
    const [caption, setCaption] = useState("");
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("video/")) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file)); // Generate local URL preview
            setError(null);
        } else {
            setError("Please select a valid video file (e.g., MP4, MOV)");
            clearSelectedVideo();
        }
    };

    const clearSelectedVideo = () => {
        if (videoPreview) URL.revokeObjectURL(videoPreview); // Clean up memory leak
        setVideo(null);
        setVideoPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!video) {
            setError("Please select a video");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("video", video);
            formData.append("caption", caption);

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/videos/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.status}`);
            }

            const data = await res.json();
            setCaption("");
            clearSelectedVideo();
            
            if (onUploadSuccess) {
                onUploadSuccess(data.video);
            }
            
            navigate("/"); // Smooth redirect back to home feed
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-[#0F172A] flex items-center justify-center p-4 pb-20 md:pb-4 text-[#F8FAFC]">
            <div className="w-full max-w-4xl bg-[#1E293B] rounded-2xl shadow-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8 border border-[#334155]">
                
                {/* LEFT SIDE: FILE UPLOAD ZONE & PREVIEW */}
                <div className="flex flex-col items-center justify-center">
                    {!videoPreview ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-[9/16] max-h-[450px] border-2 border-dashed border-[#475569] hover:border-[#FE2C55] rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-[#0F172A]/50 transition group"
                        >
                            <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-4 text-[#94A3B8] group-hover:text-[#FE2C55] group-hover:scale-110 transition">
                                <FaCloudUploadAlt className="text-3xl" />
                            </div>
                            <p className="font-semibold text-base mb-1">Select video to upload</p>
                            <p className="text-xs text-[#94A3B8] max-w-[200px]">
                                MP4 or WebM, vertical layout aspect ratio recommended.
                            </p>
                            <button type="button" className="mt-6 px-4 py-2 bg-[#FE2C55] text-sm font-medium rounded-md hover:bg-[#e02447] transition">
                                Select File
                            </button>
                        </div>
                    ) : (
                        <div className="w-full aspect-[9/16] max-h-[450px] bg-black rounded-xl overflow-hidden relative group border border-[#334155]">
                            <video 
                                src={videoPreview} 
                                className="w-full h-full object-contain" 
                                controls
                                muted
                            />
                            <button 
                                type="button"
                                onClick={clearSelectedVideo}
                                className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-[#FE2C55] drop-shadow-md z-10 transition"
                            >
                                <IoCloseCircle />
                            </button>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="video/*" 
                        onChange={handleVideoSelect} 
                        className="hidden" 
                    />
                </div>

                {/* RIGHT SIDE: CAPTION FORM METADATA */}
                <form onSubmit={handleUpload} className="flex flex-col justify-between h-full space-y-6">
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tight mb-1">Create post</h2>
                            <p className="text-xs text-[#94A3B8]">Configure your short-form video upload data fields.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg mb-4">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Caption Field */}
                        <div className="mb-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2 flex items-center gap-1.5">
                                <FaHashtag /> Caption
                            </label>
                            <div className="relative bg-[#0F172A] rounded-xl border border-[#334155] focus-within:border-gray-500 transition overflow-hidden">
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Add an engaging caption #trending #viral..."
                                    className="w-full bg-transparent outline-none p-3 text-sm text-white h-32 resize-none placeholder-gray-600"
                                    maxLength={300}
                                    disabled={loading}
                                />
                                <span className="absolute bottom-2 right-3 text-[10px] text-[#64748B] font-mono">
                                    {caption.length}/300
                                </span>
                            </div>
                        </div>

                        {/* File Meta Pill */}
                        {video && (
                            <div className="flex items-center gap-2 bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
                                <FaFilm className="text-[#25F4EE] text-sm shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium truncate text-gray-300">{video.name}</p>
                                    <p className="text-[10px] text-gray-500">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Actions Button Module */}
                    <div className="flex gap-3 pt-4 border-t border-[#334155]">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 py-2.5 rounded-xl border border-[#475569] text-sm font-semibold hover:bg-[#334155] transition text-white"
                            disabled={loading}
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !video}
                            className="flex-1 py-2.5 rounded-xl bg-[#FE2C55] disabled:bg-[#475569] text-white text-sm font-semibold hover:bg-[#e02447] disabled:text-gray-400 transition shadow-lg relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Posting...</span>
                                </div>
                            ) : (
                                "Post Video"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VideoUpload;