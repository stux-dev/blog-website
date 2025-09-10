import React, { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';


const ProgressBar = () => (
   <div className="w-full max-w-xs h-0.5 bg-gray-800 rounded-full overflow-hidden"
        style={{
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
   >
       <div className="w-full h-full relative">
           <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-white rounded-full animate-indeterminate-progress"></div>
       </div>
   </div>
);

export const LoadingScreen = () => {
    const { isLoading } = useLoading();
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setIsRendering(true);
        } else {
            const timer = setTimeout(() => setIsRendering(false), 500); // Wait for fade-out
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isRendering) return null;

    return (
        <div
            className={`fixed inset-0 bg-[#0F0F0F] select-none flex flex-col items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${!isLoading ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="font-unbounded text-3xl font-[700] text-white mb-6">StuxBlog</div>
            <ProgressBar />
        </div>
    );
};