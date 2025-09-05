import apiClient from "../api/apiClient"

export const blogService = {
    getAll: async() => {
        try{
            const response = await apiClient.get("/api/blog/blogs");
            return response.data;
        }catch(error){
            console.error("Error Loading Blogs", error);
            throw error;
        }
    },

    getBySlug: async(slug) => {
        try{
            const response = await apiClient.get(`/api/blog/${slug}`);
            return response.data;
        }catch(error){
            console.error(`Error fetching blog with slug ${slug}:`, error);
            throw error;
        }
    },

    create: async(blogData) => {
        try{
            const response = await apiClient.post("/api/blog/create", blogData);
            return response.data;
        }catch(error){
            console.error('Error creating blog:', error);
            throw error;
        }
    }
}