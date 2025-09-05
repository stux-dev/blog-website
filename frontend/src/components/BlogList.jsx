import React from 'react'
import {useQuery} from '@tanstack/react-query'
import { blogService } from '../services/blogService'
import BlogCard from './BlogCard'
const BlogList = () => {

    const { data: blogs , error, isLoading} = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })


    if (isLoading) return <p>Loading blogs...</p>;
    if (error) return <p>An error occurred: {error.message}</p>;

    return (
        <div className="bg-[#0F0F0F] min-h-screen">

            <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
            {blogs?.blogData.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
            </div>
        </div>
    )
}

export default BlogList;
