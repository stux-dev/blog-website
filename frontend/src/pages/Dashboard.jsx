import React, { useEffect } from "react";
import BlogList from "../components/BlogList";
import { useLoading } from "../context/LoadingContext";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blogService";
import { motion } from "framer-motion";

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
      <div>
        <BlogList blogs={blogs} />
      </div>
    </motion.div>
  );
};

export default Dashboard;
