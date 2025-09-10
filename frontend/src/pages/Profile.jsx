import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { blogService } from "../services/blogService";
import { useLoading } from "../context/LoadingContext";
import { useEffect } from "react";
import BlogList from "../components/BlogList";

// Helper function to process chart data (no changes needed here)
const processChartData = (apiData) => {
    const dataAsArray = Array.isArray(apiData)
        ? apiData
        : apiData
        ? [apiData]
        : [];

    if (dataAsArray.length === 0) return [];

    const viewsMap = new Map(
        dataAsArray.map((item) => [item.view_date, Number(item.daily_views)])
    );
    const resultData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDateKey = `${year}-${month}-${day}`;

        const views = viewsMap.get(formattedDateKey) || 0;

        resultData.push({
            date: date.toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit",
            }),
            views: views,
        });
    }
    return resultData;
};


const Profile = () => {
    const { userId } = useParams();
    const { showLoader, hideLoader } = useLoading();

    // Queries for user info, stats, and blogs (no changes needed here)
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

    // Loading effect (no changes needed here)
    useEffect(() => {
        if (isStatsLoading || isUserInfoLoading || isBlogsLoading) {
            showLoader();
        } else {
            hideLoader();
        }
        return () => hideLoader();
    }, [isStatsLoading, isUserInfoLoading, isBlogsLoading, showLoader, hideLoader]);

    // Error and loading states (no changes needed here)
    if (isUserInfoError || isStatsError || isBlogError) {
        const error = userInfoError || statsError || blogError;
        return <div className="text-red-500 text-center p-10">Error loading profile: {error.message}</div>;
    }
    if (isUserInfoLoading || isStatsLoading || isBlogsLoading) {
        return null;
    }
    if (!userInfo || !dailyStats) {
        return <div className="text-white text-center p-10">No data available.</div>;
    }

    const chartData = processChartData(dailyStats);
    const fullName = `${userInfo.first_name.charAt(0).toUpperCase() + userInfo.first_name.slice(1)} ${userInfo.last_name.charAt(0).toUpperCase() + userInfo.last_name.slice(1)}`;
    const initials = `${userInfo.first_name.charAt(0).toUpperCase()}${userInfo.last_name.charAt(0).toUpperCase()}`;
    const avatarPlaceholderUrl = `https://placehold.co/100x100/1a1a1a/ffffff?text=${initials}&font=inter`;
    const dob = userInfo.dob.split("-").reverse().join("/");

    return (
        <div className="bg-[#0F0F0F] min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
            {/* Main content wrapper with responsive horizontal padding */}
            <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                {/* Profile and Chart Section */}
                {/* This container stacks vertically on mobile (flex-col) and switches to a row on large screens (lg:flex-row) */}
                <div className="flex flex-col lg:flex-row h-auto gap-4">
                    {/* User Profile Card */}
                    {/* Takes full width on mobile (w-full) and 1/3 width on large screens (lg:w-1/3) */}
                    <div className="w-full lg:w-1/3 bg-[#0F0F0F] border border-[#3C3C3C] rounded-lg p-6">
                        {/* Avatar and info stack on extra-small screens and become a row on small screens (sm:flex-row) */}
                        <div className="flex flex-col sm:flex-row items-center justify-start">
                            <img
                                className="w-24 h-24 rounded-full mr-0 sm:mr-6 border-2 border-[#3C3C3C]"
                                src={avatarPlaceholderUrl}
                                alt="User Avatar"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/100x100/CCCCCC/FFFFFF?text=U`;
                                }}
                            />
                            {/* Text is centered on extra-small screens and left-aligned on small and up */}
                            <div className="font-mono text-white mt-4 sm:mt-0 text-center sm:text-left">
                                <div className="text-xl font-bold">{fullName}</div>
                                <div className="text-sm text-gray-400">{dob}</div>
                                <div className="text-sm text-gray-400">{userInfo.email}</div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-[#3C3C3C] my-6"></div>
                    </div>

                    {/* Daily Views Chart */}
                    {/* Takes full width on mobile (w-full) and 2/3 width on large screens (lg:w-2/3) */}
                    <div className="w-full lg:w-2/3 bg-[#0F0F0F] border border-[#3C3C3C] rounded-lg p-6 flex flex-col">
                        <h2 className="text-xl font-bold font-mono text-white mb-4">
                            Daily Views (Last 7 Days)
                        </h2>
                        {/* IMPROVEMENT: Chart height is now responsive. Shorter on mobile, taller on desktop */}
                        <div className="flex-grow w-full h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3C3C3C" />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1F1F1F", border: "1px solid #3C3C3C", borderRadius: "0.5rem" }}
                                        labelStyle={{ color: "#ffffff" }}
                                        itemStyle={{ color: "#8884d8" }}
                                    />
                                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DIVIDER --- */}
            <div className="h-px bg-[#3C3C3C] my-8 max-w-6xl mx-auto"></div>

            {/* Render the responsive BlogList component */}
           <div className="font-unbounded text-2xl font-bold max-w-7xl mx-auto px-8 select-none">Your Blogs</div>
            <BlogList blogs={userBlogs} />
          
        </div>
    );
};

export default Profile;