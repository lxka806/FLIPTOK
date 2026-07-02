import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import VideoUpload from "../components/VideoUpload";

function CreateVideo() {
    const navigate = useNavigate();

    const handleUploadSuccess = () => {
        // Removed the disruptive window alert popup to keep a native app UX flow
        navigate("/"); 
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col relative overflow-x-hidden select-none">
            {/* Top Navigation or Base Fixed Setup layout */}
            <NavBar />

            {/* MAIN ROUTE CONTENT WRAPPER */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 md:py-12 relative z-10">
                
                {/* ADVANCED GRADIENT BLUR BACKDROPS (TikTok Style Glow) */}
                <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#FE2C55]/15 blur-[120px] md:blur-[160px] rounded-full top-10 left-[-10%] pointer-events-none" />
                <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#25F4EE]/10 blur-[120px] md:blur-[160px] rounded-full bottom-20 right-[-10%] pointer-events-none" />

                {/* OPTIONAL SUB-HEADER FOR DESKTOP VIEWS (Hidden on mobile to save precious feed real estate) */}
                <div className="hidden md:block text-center mb-6 max-w-md animate-fade-in">
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#FE2C55] via-purple-400 to-[#25F4EE] bg-clip-text text-transparent">
                        Upload Video
                    </h1>
                    <p className="text-sm text-gray-400 mt-1.5 font-light">
                        Share your moments and reach millions of viewers.
                    </p>
                </div>

                {/* MOUNTED CORE VIDEO UPLOAD CHILD LOGIC MODAL */}
                <div className="w-full max-w-4xl relative z-20">
                    <VideoUpload onUploadSuccess={handleUploadSuccess} />
                </div>
            </main>
        </div>
    );
}

export default CreateVideo;