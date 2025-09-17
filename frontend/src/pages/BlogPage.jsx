import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { blogService } from "../services/blogService";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useLoading } from "../context/LoadingContext";
import { useAuth } from "../context/AuthContext"; 
import { FilePenLine, Trash2 } from "lucide-react"; 

const BlogPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoading();

    const { data: blog, error, isLoading } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => blogService.getBySlug(slug),
        enabled: !!slug,
        refetchOnWindowFocus: false,
    });

    const isAuthor = useMemo(() => {
        if (!user || !blog) return false;
        return user.id === blog.user_id;
    }, [user, blog]);

    const editor = useCreateBlockNote({ editable: false });

    useEffect(() => {
        if (editor && blog?.content) {
            try {
                const blocks = JSON.parse(blog.content);
                editor.replaceBlocks(editor.document, blocks);
            } catch (e) {
                console.error("Failed to parse blog content:", e);
            }
        }
    }, [editor, blog]);

    useEffect(() => {
        isLoading ? showLoader() : hideLoader();
        return () => hideLoader();
    }, [isLoading, showLoader, hideLoader]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
            try {
                await blogService.delete(blog.id); 
                alert("Blog post deleted successfully.");
                navigate("/dashboard"); 
            } catch (err) {
                alert("Failed to delete the blog post.");
                console.error(err);
            }
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Loading...";
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    if (error) return <div className="text-white text-center p-10">Error Loading Blog Post</div>;
    if (isLoading || !blog) return null; 

    return (
        <div className="bg-[#0F0F0F] min-h-screen font-sans text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Blog Header */}
                <div className="mb-8 border-b border-gray-700 pb-8">
                    {/* ✨ 5. New header layout for buttons ✨ */}
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-3xl md:text-5xl font-poppins mb-4 text-white leading-tight">
                            {blog.title}
                        </h1>
                        {isAuthor && (
                            <div className="flex items-center gap-2 flex-shrink-0 mt-2">
                                <Link to={`/blog/edit/${blog.slug}`} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                                    <FilePenLine className="w-5 h-5 text-gray-300" />
                                </Link>
                                <button onClick={handleDelete} className="p-2 rounded-md bg-red-800 hover:bg-red-700 transition-colors">
                                    <Trash2 className="w-5 h-5 text-gray-200" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* ... (rest of the metadata remains the same) ... */}
                    <div className="flex flex-wrap font-mono items-center text-sm text-gray-400 space-x-4">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <Link to={`/profile/${blog.user_id}`} className="hover:underline capitalize">
                                {`${blog.first_name} ${blog.last_name}`}
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                            <span>{formatDate(blog.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                            <span>{blog.view_count} views</span>
                        </div>
                    </div>
                </div>

                {/* BlockNote editor view */}
                <div className="prose prose-invert prose-lg max-w-none">
                     <BlockNoteView editor={editor} editable={false} />
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
