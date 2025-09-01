import React from 'react';

// A modern 404 "Page Not Found" component using a shadcn/ui-inspired dark theme with Tailwind CSS.
// This component is designed to be displayed when a user navigates to a URL that does not have a route.
export default function App() {
  return (
    <div className="bg-zinc-950 flex items-center justify-center min-h-screen font-sans">
      <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        {/* The 404 Error Code */}
        <h1 className="text-9xl font-extrabold text-zinc-200 tracking-wider">
          404
        </h1>
        
        {/* Page Not Found Title */}
        <h2 className="text-3xl font-bold text-zinc-50 mt-4">
          Oops! Page Not Found
        </h2>
        
        {/* Informative message for the user */}
        <p className="text-zinc-400 mt-4 text-lg">
          Sorry, the page you are looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        {/* "Go Home" button/link styled like a shadcn/ui primary button */}
        <a 
          href="/" 
          className="mt-8 inline-block bg-zinc-50 text-zinc-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-zinc-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back to Homepage
        </a>
      </div>
    </div>
  );
}