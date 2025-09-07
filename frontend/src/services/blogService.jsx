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

    getById: async(blogId) => {
        try{
            const response = await apiClient.get(`/api/blog/id/${blogId}`);
            return response.data;
        }
        catch(error){
            console.error(`Error fetching blog with blogId ${blogId}:`, error);
            throw error;
        }
    },

    create: async(blogData) => {
        try{
            const response = await apiClient.post("/api/blog/new", blogData);
            return response.data;
        }catch(error){
            console.error('Error creating blog:', error);
            throw error;
        }
    },

    update: async(blogId,blogData) => {
        try{

            const response = await apiClient.patch(`/api/blog/${blogId}`, blogData);
            return response.data;
        }
        catch(error){
            console.error('Error updating blog:', error);
            throw error;
        }
    }

}