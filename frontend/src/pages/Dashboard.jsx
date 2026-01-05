import React, { useEffect } from "react";
import BlogList from "../components/BlogList";
import { useLoading } from "../context/LoadingContext";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { showLoader, hideLoader } = useLoading();
  const {
    data: blogs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

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
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
     >
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
       
        <Link
          to="/blog/new"
          className="group inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1A1A1A] border-2 border-[#3C3C3C] rounded-lg text-white font-poppins transition-colors hover:bg-[#3C3C3C]"
        >
          <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90"/>
          Create Blog
        </Link>
        
       </div>

      <div>
        <BlogList blogs={blogs} />
      </div>
    </motion.div>
  );
};

export default Dashboard;
