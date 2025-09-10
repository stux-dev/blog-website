import React, { useEffect } from "react";
import BlogList from "../components/BlogList";
import { useLoading } from "../context/LoadingContext";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";


const Dashboard = () => {

    const {showLoader, hideLoader} = useLoading();
    const { data: blogs , error, isLoading} = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })



    useEffect(() => {
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }

        // Optional: Ensure the loader is hidden if the component unmounts while loading
        return () => hideLoader();
    }, [isLoading, showLoader, hideLoader]);
    if (error) return <p>An error occurred: {error.message}</p>;
    return (
        <div>

          

           
            <BlogList blogs={blogs} />
       
        </div>
    );
};

export default Dashboard;
