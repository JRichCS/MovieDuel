import React from 'react';

const LandingPage = () => {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-2xl">
                <h1 className="text-4xl font-bold text-white mb-4">🎬 MovieVerse</h1>
                <h2 className="text-lg text-gray-300 mb-6">
                    Your ultimate movie database.
                </h2>
                <p className="text-gray-200 mb-6">
                    Discover, rate, and track your favorite films. Dive into a universe of cinema with MovieVerse — built for movie lovers.
                </p>
                <div className="flex space-x-4">
                    <a
                        href="/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                    >
                        Sign Up
                    </a>
                    <a
                        href="/login"
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded"
                    >
                        Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
