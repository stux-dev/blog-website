import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { motion } from 'framer-motion';

const UpsertBlogPostPage = () => {
    const { blogSlug } = useParams();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isEditMode = Boolean(blogSlug);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    // This will now store the content as a JSON string, as the backend expects
    const [content, setContent] = useState(""); 

    const editor = useCreateBlockNote();

    // FIX 1: Correctly save the editor's content to state as a JSON string
    useEditorChange((currentEditor) => {
        // editor.document is an array of Block objects.
        // We stringify it once to store it in our state.
        const blocksAsJsonString = JSON.stringify(currentEditor.document);
        setContent(blocksAsJsonString);
    }, editor);

    const { data: existingBlog, isLoading: isLoadingBlog, isError } = useQuery({
        queryKey: ['blog', blogSlug],
        queryFn: () => blogService.getBySlug(blogSlug),
        enabled: isEditMode,
        staleTime: Infinity
    });

    // FIX 2: Correctly populate the form AND the editor in edit mode
    useEffect(() => {
        // The condition is now correct: it runs WHEN in edit mode and data exists.
        if (isEditMode && existingBlog) {
            setTitle(existingBlog.title);
            setSlug(existingBlog.slug);

            // Populate the BlockNote editor
            if (existingBlog.content && editor) {
                try {
                    // The content from your DB is a JSON string. We must parse it
                    // into an array of Block objects for the editor.
                    const initialContent = JSON.parse(existingBlog.content);
                    // This command replaces the editor's current content (which is empty)
                    // with the content loaded from the database.
                    editor.replaceBlocks(editor.document, initialContent);
                } catch (e) {
                    console.error("Failed to parse and load blog content:", e);
                }
            }
        }
        // Add 'editor' to the dependency array to ensure this runs once the editor is ready.
    }, [isEditMode, existingBlog, editor]);

    const { mutate, isPending: isSaving } = useMutation({
        mutationFn: (blogData) => {
            return isEditMode
                ? blogService.update(blogSlug, blogData)
                : blogService.create(blogData);
        },
        onSuccess: (savedPost) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            // Invalidate the specific blog query to ensure fresh data if we revisit
            queryClient.invalidateQueries({ queryKey: ['blog', blogSlug] }); 
            navigate(`/blog/${savedPost.slug}`);
        },
        onError: (error) => {
            console.error('Failed to save blog post:', error);
            alert(`Error: ${error.message}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const blogData = {
            title,
            slug,
            content, // content is now correctly formatted as a JSON string
            status: 'published',
        };
        mutate(blogData);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        const newSlug = newTitle.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        setSlug(newSlug);
    };

    if (isEditMode && isLoadingBlog) {
        return <div className='text-white'>Loading Blog...</div>;
    }

    if (isEditMode && isError) {
        return <div className='text-white'>Error loading post for editing. Please try again.</div>;
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}  
      >
      
        // Your JSX remains the same
        // A good practice with Shadcn/ui is to use a utility function
// for class names, like `cn`, but for this example, we'll just use strings.

<div className="bg-[#0F0F0F] min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-poppins font-bold tracking-tight mb-6 text-gray-50">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <form onSubmit={handleSubmit}>
            {/* --- Title Input --- */}
            <div className="grid w-full items-center gap-1.5 mb-6">
                <label
                    htmlFor="title"
                    className="text-sm font-mono text-gray-400"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    className="bg-[#1F1F1F] border border-[#3C3C3C] text-white text-sm rounded-lg  block w-full p-2.5"
                />
            </div>

            {/* --- Slug Input --- */}
            <div className="grid w-full items-center gap-1.5 mb-6">
                <label
                    htmlFor="slug"
                    className="text-sm font-mono text-gray-400"
                >
                    Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="bg-[#1F1F1F] border border-[#3C3C3C] text-white text-sm rounded-lg  block w-full p-2.5"
                />
            </div>

            {/* --- BlockNote Editor --- */}
            <div className="my-6 mprose prose-invert prose-p:text-gray-200">
              <p className='mb-2 text-gray-400 text-sm font-mono'>Content</p>
                <BlockNoteView editor={editor} theme="dark" />
            </div>

            {/* --- Submit Button --- */}
            <button
                type="submit"
                disabled={isSaving}
                className="
        /* Base Styles */
        appearance-none 
        bg-transparent 
        border-2 border-[#E0E0E0]
        rounded-[0.8em] /* Adjusted for new size */
        box-border 
        text-[#E0E0E0]
        cursor-pointer 
        inline-block 
        font-sans 
        text-sm /* Made font smaller */
        font-semibold 
        leading-normal 
        m-0 
        min-h-[3em] /* Reduced min height */
        min-w-0 
        outline-none 
        py-[0.75em] px-[1.75em] /* Reduced padding */
        text-center 
        no-underline 
        select-none 
        touch-manipulation 
        will-change-transform

        /* Transitions */
        transition-all 
        duration-300 
        ease-[cubic-bezier(.23,1,0.32,1)]

        /* Disabled State */
        disabled:pointer-events-none disabled:opacity-50

        /* Hover State */
        hover:text-[#1A1A1A]
        hover:bg-[#E0E0E0]
        hover:shadow-[0_8px_15px_rgba(224,224,224,0.1)]
        hover:-translate-y-0.5

        /* Active State */
        active:shadow-none 
        active:translate-y-0
      "
            >
                {isSaving ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
            </button>
        </form>
    </div>
</div>
      </motion.div>
    );
};

export default UpsertBlogPostPage;