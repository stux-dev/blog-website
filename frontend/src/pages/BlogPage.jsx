import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogService } from "../services/blogService";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useLoading } from "../context/LoadingContext";

const BlogPage = () => {
    const { slug } = useParams();
    const {
        data: blog,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => blogService.getBySlug(slug),
        enabled: !!slug,
        refetchOnWindowFocus: false,
    });

    const { showLoader, hideLoader } = useLoading();

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const editor = useCreateBlockNote();

    useEffect(() => {
        if (editor && blog?.content) {
            editor.replaceBlocks(editor.document, JSON.parse(blog.content));
        }
    }, [editor, blog]);

    useEffect(() => {
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }
        // Cleanup function to hide loader if component unmounts
        return () => hideLoader();
    }, [isLoading, showLoader, hideLoader]);

    if (error) {
        return <div className="text-white">Error Loading Blog</div>;
    }

    return (
        <div className="bg-[#0F0F0F] min-h-screen font-sans text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Blog Header */}
                <div className="mb-8 border-b border-gray-700 pb-8">
                    <h1 className="text-3xl md:text-5xl font-poppins mb-4 text-white leading-tight">
                        {blog?.title}
                    </h1>
                    <div className="flex flex-wrap font-mono items-center text-sm text-gray-400 space-x-4">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 mr-2 text-gray-500"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>

                            <span className="capitalize">{`${blog?.first_name} ${blog?.last_name}`}</span>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 mr-2 text-gray-500"
                            >
                                <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>

                            <span>{formatDate(blog?.created_at)}</span>
                        </div>

                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 mr-2 text-gray-500"
                            >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>{blog?.view_count} views</span>
                        </div>
                    </div>
                </div>

                <BlockNoteView
                    editor={editor}
                    className="m-2"
                    editable={false}
                />
            </div>
        </div>
    );
};

export default BlogPage;
