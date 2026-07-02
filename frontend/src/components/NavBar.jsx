import { FaHome, FaUserCheck, FaRegCompass } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { DEFAULT_PROFILE_IMAGE } from "../constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function NavBar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    
    // Mobile Search Modal States
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [mobileVideos, setMobileVideos] = useState([]);
    const [mobileUsers, setMobileUsers] = useState([]);
    const [mobileSearchTab, setMobileSearchTab] = useState("videos");
    const [mobileSearchLoading, setMobileSearchLoading] = useState(false);

    // Helper function to handle active route styling
    const isActive = (path) => location.pathname === path ? "text-[#FE2C55]" : "text-[#94A3B8] md:text-[#F8FAFC]";

    // Mobile search function
    const handleMobileSearch = async () => {
        if (!mobileSearchQuery.trim()) return;
        
        try {
            setMobileSearchLoading(true);
            
            // Search videos
            const videosRes = await fetch(
                `${API_BASE_URL}/api/videos/search?query=${encodeURIComponent(mobileSearchQuery)}`
            );
            const videosData = await videosRes.json();
            setMobileVideos(videosData.videos || []);

            // Search users
            const usersRes = await fetch(
                `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(mobileSearchQuery)}`
            );
            const usersData = await usersRes.json();
            setMobileUsers(usersData.users || []);
        } catch (err) {
            console.error("Mobile search error:", err);
        } finally {
            setMobileSearchLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    return (
        <>
            {/* DESKTOP TOP HEADER (Hidden on mobile) */}
            <header className="hidden md:flex items-center justify-between px-6 py-3 bg-[#0F172A] border-b border-[#1E293B] text-[#F8FAFC] fixed top-0 left-0 right-0 z-50 h-16">
                {/* Logo / Brand Name */}
                <Link to="/" className="text-xl font-bold tracking-wider bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] bg-clip-text text-transparent">
                    FLIPTOK
                </Link>

                {/* Desktop Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link to="/" className={`flex items-center gap-2 cursor-pointer hover:text-[#FE2C55] transition ${isActive("/")}`}>
                        <FaHome className="text-lg" />
                        <span className="text-sm font-medium">For You</span>
                    </Link>
                    <Link to="/following" className={`flex items-center gap-2 cursor-pointer hover:text-[#FE2C55] transition ${isActive("/following")}`}>
                        <FaUserCheck className="text-lg" />
                        <span className="text-sm font-medium">Following</span>
                    </Link>
                    <Link to="/create-video" className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#2D3748] px-4 py-1.5 rounded-full border border-gray-700 transition">
                        <FaPlus className="text-xs text-white" />
                        <span className="text-sm font-medium text-white">Upload</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center bg-[#1E293B] px-4 py-2 rounded-full w-[300px] border border-transparent focus-within:border-gray-500 transition">
                    <CiSearch className="text-[#94A3B8] text-xl" />
                    <input
                        type="text"
                        placeholder="Search accounts and videos"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-[#64748B]"
                    />
                </form>

                {/* Profile / Auth Operations */}
                <div>
                    {user ? (
                        <Link to='/profile' className="flex items-center gap-3 group">
                            <span className="text-sm font-medium hidden lg:inline text-[#F8FAFC] group-hover:text-gray-300">{user.username}</span>
                            <img
                                src={user?.image || DEFAULT_PROFILE_IMAGE}
                                alt="Profile"
                                onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
                                className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-[#FE2C55] transition"
                            />
                        </Link>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login">
                                <button className="px-4 py-1.5 rounded-md text-sm font-semibold bg-[#FE2C55] text-white hover:bg-[#e02447] transition">
                                    Log In
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION BAR (Sticky at base, hidden on desktop) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-[#1E293B] h-16 z-50 flex items-center justify-around px-2 pb-safe">
                
                {/* Home Button */}
                <Link to="/" className={`flex flex-col items-center justify-center w-12 h-12 ${isActive("/")}`}>
                    <FaHome className="text-2xl" />
                    <span className="text-[10px] mt-0.5">Home</span>
                </Link>

                {/* Search / Discover Button - Opens Mobile Modal */}
                <button 
                    onClick={() => setMobileSearchOpen(true)}
                    className={`flex flex-col items-center justify-center w-12 h-12 text-[#94A3B8] hover:text-[#FE2C55] transition`}
                >
                    <CiSearch className="text-2xl stroke-[1]" />
                    <span className="text-[10px] mt-0.5">Search</span>
                </button>

                {/* TikTok Styled Action Center Button */}
                <Link to="/create-video" className="flex items-center justify-center relative w-14 h-10 mx-2">
                    {/* Left cyan design accent */}
                    <div className="absolute inset-0 bg-[#25F4EE] rounded-md left-[-3px] right-[3px] top-1 bottom-1"></div>
                    {/* Right magenta design accent */}
                    <div className="absolute inset-0 bg-[#FE2C55] rounded-md left-[3px] right-[-3px] top-1 bottom-1"></div>
                    {/* Center white module */}
                    <div className="absolute inset-0 bg-white rounded-md top-1 bottom-1 flex items-center justify-center text-black font-bold">
                        <FaPlus className="text-sm" />
                    </div>
                </Link>

                {/* Following Button */}
                <Link to="/following" className={`flex flex-col items-center justify-center w-12 h-12 ${isActive("/following")}`}>
                    <FaUserCheck className="text-xl" />
                    <span className="text-[10px] mt-0.5">Following</span>
                </Link>

                {/* Mobile Profile Link */}
                {user ? (
                    <Link to='/profile' className="flex flex-col items-center justify-center w-12 h-12">
                        <img
                            src={user?.image || DEFAULT_PROFILE_IMAGE}
                            alt="Profile"
                            onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
                            className={`w-6 h-6 rounded-full object-cover border ${location.pathname === '/profile' ? 'border-[#FE2C55]' : 'border-transparent'}`}
                        />
                        <span className={`text-[10px] mt-0.5 ${location.pathname === '/profile' ? 'text-[#FE2C55]' : 'text-[#94A3B8]'}`}>Profile</span>
                    </Link>
                ) : (
                    <Link to="/login" className="flex flex-col items-center justify-center w-12 h-12 text-[#94A3B8]">
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-[10px] font-bold">?</div>
                        <span className="text-[10px] mt-0.5">Me</span>
                    </Link>
                )}
            </nav>
            
            {/* Main content wrapper spacer so the layouts do not overlap content */}
            <div className="h-0 md:h-16 pt-0 pb-16 md:pb-0"></div>

            {/* MOBILE SEARCH MODAL */}
            {mobileSearchOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] md:hidden flex flex-col">
                    {/* Modal Header */}
                    <div className="bg-[#0F172A] border-b border-[#1E293B] p-4 flex items-center justify-between">
                        <h2 className="text-white font-bold text-lg">Search</h2>
                        <button
                            onClick={() => setMobileSearchOpen(false)}
                            className="text-white text-2xl hover:text-[#FE2C55] transition"
                        >
                            <MdClose />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="bg-[#0F172A] px-4 py-3 border-b border-[#1E293B]">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleMobileSearch();
                            }}
                            className="flex items-center bg-[#1E293B] px-4 py-2 rounded-full border border-transparent focus-within:border-gray-500 transition"
                        >
                            <CiSearch className="text-[#94A3B8] text-xl" />
                            <input
                                type="text"
                                placeholder="Search videos and accounts"
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                autoFocus
                                className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-[#64748B]"
                            />
                        </form>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1 overflow-y-auto bg-[#0F172A]">
                        {mobileSearchQuery.trim() === "" ? (
                            <div className="p-4 text-center text-gray-400">
                                <p>Enter a search query to get started</p>
                            </div>
                        ) : mobileSearchLoading ? (
                            <div className="p-4 text-center text-gray-400">Loading...</div>
                        ) : (
                            <>
                                {/* Tabs */}
                                <div className="flex gap-4 px-4 pt-4 border-b border-gray-700 sticky top-0 bg-[#0F172A]">
                                    <button
                                        onClick={() => setMobileSearchTab("videos")}
                                        className={`pb-3 px-2 font-bold transition text-sm ${
                                            mobileSearchTab === "videos"
                                                ? "text-white border-b-2 border-[#FE2C55]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        Videos ({mobileVideos.length})
                                    </button>
                                    <button
                                        onClick={() => setMobileSearchTab("users")}
                                        className={`pb-3 px-2 font-bold transition text-sm ${
                                            mobileSearchTab === "users"
                                                ? "text-white border-b-2 border-[#FE2C55]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        Users ({mobileUsers.length})
                                    </button>
                                </div>

                                {/* Videos Tab Results */}
                                {mobileSearchTab === "videos" && (
                                    <div className="p-4">
                                        {mobileVideos.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">No videos found</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {mobileVideos.map((video) => (
                                                    <div
                                                        key={video._id}
                                                        className="bg-[#1E293B] rounded-lg p-3 hover:bg-[#2D3748] transition cursor-pointer"
                                                        onClick={() => setMobileSearchOpen(false)}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0">
                                                                <img
                                                                    src={video.user?.image || DEFAULT_PROFILE_IMAGE}
                                                                    alt="Video"
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-semibold text-sm line-clamp-2">
                                                                    {video.caption}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    By {video.user?.username}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    ❤️ {video.likes?.length || 0} likes
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Users Tab Results */}
                                {mobileSearchTab === "users" && (
                                    <div className="p-4">
                                        {mobileUsers.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">No users found</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {mobileUsers.map((searchUser) => (
                                                    <Link
                                                        key={searchUser._id}
                                                        to={`/profile/${searchUser._id}`}
                                                        onClick={() => setMobileSearchOpen(false)}
                                                        className="bg-[#1E293B] rounded-lg p-3 hover:bg-[#2D3748] transition block"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={searchUser.image || DEFAULT_PROFILE_IMAGE}
                                                                alt={searchUser.username}
                                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-bold text-sm">
                                                                    {searchUser.username}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    {searchUser.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {searchUser.followers?.length || 0} followers • {searchUser.totalPosts || 0} videos
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;