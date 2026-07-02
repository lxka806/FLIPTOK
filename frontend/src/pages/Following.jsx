import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function Following() {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.status}`);
            const userData = await userRes.json();
            if (!userData.user) throw new Error("User data not found in response");

            setCurrentUser(userData.user);

            const allUsersRes = await fetch(`${API_BASE_URL}/api/users/all`);
            if (!allUsersRes.ok) throw new Error(`Failed to fetch users: ${allUsersRes.status}`);
            const allUsersData = await allUsersRes.json();
            setAllUsers(allUsersData.users);

            const followingIds = userData.user.following.map((id) => id.toString());

            const following = allUsersData.users.filter((user) =>
                followingIds.includes(user._id.toString())
            );

            const suggested = allUsersData.users.filter((user) =>
                !followingIds.includes(user._id.toString()) &&
                user._id.toString() !== userData.user._id.toString()
            );

            setFollowingUsers(following);
            setSuggestedUsers(suggested);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/users/follow/${userId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const userToFollow = suggestedUsers.find((u) => u._id === userId);
                if (userToFollow) {
                    setFollowingUsers([...followingUsers, userToFollow]);
                    setSuggestedUsers(suggestedUsers.filter((u) => u._id !== userId));
                    setCurrentUser({
                        ...currentUser,
                        following: [...currentUser.following, userId],
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/users/unfollow/${userId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const userToUnfollow = followingUsers.find((u) => u._id === userId);
                if (userToUnfollow) {
                    setSuggestedUsers([...suggestedUsers, userToUnfollow]);
                    setFollowingUsers(followingUsers.filter((u) => u._id !== userId));
                    setCurrentUser({
                        ...currentUser,
                        following: currentUser.following.filter((id) => id.toString() !== userId),
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Responsive Platform-Centric Card Component
    const UserRowOrCard = ({ user, isFollowing, onAction }) => (
        <div className="flex items-center justify-between p-3.5 md:p-5 bg-[#1E293B]/40 hover:bg-[#1E293B]/80 md:bg-[#1E293B] md:flex-col md:text-center md:rounded-2xl border border-b-[#1E293B] md:border-[#334155] transition-all duration-200 group">
            
            {/* User Details Link Area */}
            <div className="flex items-center gap-3.5 md:flex-col md:gap-2 min-w-0 flex-1 md:w-full">
                <img
                    src={user.image}
                    alt={user.username}
                    className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover border-2 border-transparent group-hover:border-[#FE2C55] transition-all shrink-0"
                />
                <div className="min-w-0 flex-1 md:w-full">
                    <h3 className="text-sm md:text-base font-bold text-[#F8FAFC] truncate">
                        {user.username}
                    </h3>
                    <p className="text-xs text-[#94A3B8] truncate">{user.name}</p>
                    <p className="hidden md:block text-xs text-gray-400 mt-2 px-2 line-clamp-2 min-h-[2rem]">
                        {user.bio || "No bio yet..."}
                    </p>
                </div>
            </div>

            {/* Platform Native Styled Action CTA Button */}
            <div className="pl-4 md:pl-0 md:mt-4 md:w-full shrink-0">
                <button
                    onClick={onAction}
                    className={`text-xs font-bold px-5 py-1.5 rounded-md md:w-full transition-all active:scale-95 ${
                        isFollowing
                            ? "bg-[#334155] text-[#F8FAFC] hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30 border border-transparent"
                            : "bg-[#FE2C55] text-white hover:bg-[#e02447] shadow-md shadow-[#FE2C55]/10"
                    }`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] select-none pb-24 md:pb-10">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
                
                {/* SECTION 1: FOLLOWING USERS LIST */}
                <section className="mb-10">
                    <h2 className="text-sm md:text-lg font-black tracking-wider uppercase text-[#94A3B8] mb-4">
                        Following ({followingUsers.length})
                    </h2>
                    
                    {followingUsers.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500 bg-[#1E293B]/20 rounded-xl border border-dashed border-[#334155]">
                            You aren't following anyone yet. Discover creators below!
                        </div>
                    ) : (
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-4 bg-[#1E293B]/20 md:bg-transparent rounded-2xl overflow-hidden border border-[#1E293B] md:border-none">
                            {followingUsers.map((user) => (
                                <UserRowOrCard
                                    key={user._id}
                                    user={user}
                                    isFollowing={true}
                                    onAction={() => handleUnfollow(user._id)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* SECTION 2: SUGGESTED DISCOVERY LIST */}
                <section>
                    <h2 className="text-sm md:text-lg font-black tracking-wider uppercase text-[#94A3B8] mb-4">
                        Suggested for you
                    </h2>

                    {suggestedUsers.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500 bg-[#1E293B]/20 rounded-xl border border-dashed border-[#334155]">
                            You've caught up with everyone! No new suggestions.
                        </div>
                    ) : (
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-4 bg-[#1E293B]/20 md:bg-transparent rounded-2xl overflow-hidden border border-[#1E293B] md:border-none">
                            {suggestedUsers.map((user) => (
                                <UserRowOrCard
                                    key={user._id}
                                    user={user}
                                    isFollowing={false}
                                    onAction={() => handleFollow(user._id)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Following;