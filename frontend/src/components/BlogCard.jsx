import { Link } from "react-router-dom";

// Helper function to format the timestamp
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogCard = ({ blog }) => {
    if (!blog) {
        return null;
    }

    // Moved author name calculation here for clarity
    const authorName = `${blog.first_name.charAt(0).toUpperCase() + blog.first_name.slice(1)} ${blog.last_name.charAt(0).toUpperCase() + blog.last_name.slice(1)}`;

    return (
        <div className="relative mb-3 group bg-[#1A1A1A] border font-poppins border-[#3C3C3C] rounded-lg p-6 shadow-md hover:shadow-lg hover:border-gray-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex flex-col h-full">
                {/* Blog Title */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-3 flex-grow group-hover:underline decoration-2 underline-offset-4">
                    <Link to={`/blog/${blog.slug}`}>
                        {blog.title}
                        {/* This invisible span makes the whole card clickable for the blog post */}
                        <span className="absolute inset-0 z-0" aria-hidden="true"></span>
                    </Link>
                </h2>

                {/* Author and Date Information */}
                <div className="flex items-center text-sm text-gray-400 mt-4 font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    
                    {/* ✨ IMPROVEMENT: Replaced span with a Link ✨ */}
                    <Link
                        to={`/profile/${blog.user_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 hover:underline cursor-pointer"
                    >
                        {authorName || 'Anonymous'}
                    </Link>

                    <span className="mx-2 text-gray-600">|</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <time dateTime={new Date(blog.created_at * 1000).toISOString()}>
                        {formatDate(blog.created_at)}
                    </time>

                    <span className="mx-2 text-gray-600">|</span>

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-gray-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    <span>{blog?.view_count} views</span>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;