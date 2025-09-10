
import BlogCard from './BlogCard'

const BlogList = ({blogs}) => {

    return (
        <div className="bg-transparent min-h-screen">

            <div className="max-w-7xl min-w-lg mx-auto mt-8 px-4 sm:px-6 lg:px-8">
            {blogs?.blogData.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
            </div>
        </div>
    )
}

export default BlogList;
