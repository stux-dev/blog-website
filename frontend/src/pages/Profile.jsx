import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { blogService } from "../services/blogService";
import { useLoading } from "../context/LoadingContext";
import { useEffect, useMemo } from "react";
import BlogList from "../components/BlogList";
import { Plus } from "lucide-react";

// Custom Hook to encapsulate data fetching
const useProfileData = (userId) => {
    const { data: userInfo, isLoading: isUserInfoLoading, isError: isUserInfoError, error: userInfoError } = useQuery({
        queryKey: ["userInfo", userId],
        queryFn: () => blogService.getUserInfo(userId),
        enabled: !!userId,
    });
    const { data: dailyStats, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useQuery({
        queryKey: ["dailyStats", userId],
        queryFn: () => blogService.getDailyStats(userId),
        enabled: !!userId,
    });
    const { data: userBlogs, isLoading: isBlogsLoading, isError: isBlogError, error: blogError } = useQuery({
        queryKey: ["userBlogs", userId],
        queryFn: () => blogService.getAllForUser(userId),
        enabled: !!userId,
    });

    const isLoading = isUserInfoLoading || isStatsLoading || isBlogsLoading;
    const isError = isUserInfoError || isStatsError || isBlogError;
    const error = userInfoError || statsError || blogError;

    return { userInfo, dailyStats, userBlogs, isLoading, isError,error };
};

// Reusable component for the statistics section
const ProfileStats = ({ stats }) => (
    <>
        <div className="w-full h-px bg-[#3C3C3C] my-6"></div>
        <div className="flex justify-around text-center">
            <div>
                <div className="text-2xl font-bold font-unbounded">{stats.total_blogs}</div>
                <div className="text-xs text-gray-400 font-mono">Total Blogs</div>
            </div>
            <div>
                <div className="text-2xl font-bold font-unbounded">{stats.total_views}</div>
                <div className="text-xs text-gray-400 font-mono">Total Views</div>
            </div>
            <div>
                <div className="text-2xl font-bold font-unbounded">{Math.round(stats.average_views)}</div>
                <div className="text-xs text-gray-400 font-mono">Avg Views</div>
            </div>
        </div>
    </>
);

// Reusable component for the user's profile card
const UserProfileCard = ({ userInfo }) => {
    const { fullName, dob, email, avatarPlaceholderUrl, formattedCreationDate } = useMemo(() => {
        const first = userInfo.first_name;
        const last = userInfo.last_name;
        const creationDate = new Date(userInfo.user_creation_date.split(" ")[0]);

        return {
            fullName: `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`,
            dob: userInfo.dob.split("-").reverse().join("/"),
            email: userInfo.email,
            avatarPlaceholderUrl: `https://placehold.co/100x100/000000/ffffff?text=${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}&font=inter`,
            formattedCreationDate: new Intl.DateTimeFormat("en-US", { year: "2-digit", month: "long" }).format(creationDate).replace(" ", "'"),
        };
    }, [userInfo]);

    return (
        <div className="bg-[#0F0F0F] border border-[#3C3C3C] rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-start">
                <img className="w-24 h-24 rounded-full mr-0 sm:mr-6 border-2 border-[#3C3C3C]" src={avatarPlaceholderUrl} alt="User Avatar" />
                <div className="font-mono text-white mt-4 sm:mt-0 text-center sm:text-left">
                    <div className="text-xl font-bold">{fullName}</div>
                    <div className="text-sm text-gray-400">{dob}</div>
                    <div className="text-sm text-gray-400">{email}</div>
                    <div className="mt-2 inline-block bg-[#2A2A2A] text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Blogging since {formattedCreationDate}
                    </div>
                </div>
            </div>
            <ProfileStats stats={userInfo} />
        </div>
    );
};

// Reusable component for the create blog button card
// Reusable component for the create blog button card
const CreateBlogButton = () => (
    // No changes to this div
    <div className="bg-[#0F0F0F] border border-[#3C3C3C] rounded-lg p-4 flex flex-grow items-center">
        <Link 
            to="/blog/new" 
            className="flex items-center justify-center w-full border-2 border-[#8884d8] text-[#8884d8] font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-[#8884d8] hover:text-white"
        >
            {/* ✨ Swapped FaPlus with the Lucide Plus icon ✨ */}
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Blog</span>
        </Link>
    </div>
);
// Helper function for chart data processing
const processChartData = (apiData) => {
    // This function is fine as is, but can also be memoized if needed
    if (!apiData || apiData.length === 0) return [];

    const viewsMap = new Map(apiData.map((item) => [item.view_date, Number(item.daily_views)]));
    const resultData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDateKey = date.toISOString().split("T")[0];
        const views = viewsMap.get(formattedDateKey) || 0;
        resultData.push({
            date: date.toLocaleString("en-US", { weekday: "short", month: "short", day: "2-digit" }),
            views: views,
        });
    }
    return resultData;
};

// Main Profile Component
const Profile = () => {
    const { userId } = useParams();
    const { showLoader, hideLoader } = useLoading();
    const { userInfo, dailyStats, userBlogs, isLoading, error } = useProfileData(userId);

    useEffect(() => {
        isLoading ? showLoader() : hideLoader();
        return () => hideLoader();
    }, [isLoading, showLoader, hideLoader]);

    const chartData = useMemo(() => processChartData(dailyStats), [dailyStats]);

    if (isLoading) return null; // Loader context handles the UI
    if (error) return <div className="text-red-500 text-center p-10">Error loading profile: {error.message}</div>;
    if (!userInfo) return <div className="text-white text-center p-10">No data available.</div>;

    return (
        <div className="bg-[#0F0F0F] min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:p-8">
                <div className="flex flex-col lg:flex-row h-auto gap-4">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <UserProfileCard userInfo={userInfo} />
                        <CreateBlogButton />
                    </div>
                    <div className="w-full lg:w-2/3 bg-[#0F0F0F] border border-[#3C3C3C] rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-bold font-mono text-white mb-4">Daily Views (Last 7 Days)</h2>
                        <div className="flex-grow w-full h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3C3C3C" />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#1F1F1F", border: "1px solid #3C3C3C", borderRadius: "0.5rem" }} labelStyle={{ color: "#ffffff" }} itemStyle={{ color: "#8884d8" }} />
                                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
                <div className="h-px bg-[#3C3C3C] my-8 max-w-6xl mx-auto"></div>
                <div className="font-unbounded text-2xl font-bold max-w-7xl mx-auto px-8 select-none">Your Blogs</div>
                <BlogList blogs={userBlogs || []} />
        </div>
    );
};

export default Profile;