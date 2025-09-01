import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0F0F0F] text-white">
      <motion.h1 
        className="text-6xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      
      <motion.p 
        className="text-xl mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Oops! Page not found.
      </motion.p>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6"
      >
        <Link to="/" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
