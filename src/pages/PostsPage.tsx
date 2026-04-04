import React from 'react';

const PostsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <img src="/Logo.webp" alt="WAY" className="h-24 mx-auto mb-6" />
        </div>
        <h1 className="font-clash text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
          Coming Soon
        </h1>
        <p className="font-nekst text-gray-400 text-base md:text-lg leading-relaxed mb-10">
          Les articles et actualités de WhatAboutYou arrivent bientôt. Restez connectés pour ne rien manquer.
        </p>
        <div className="w-16 h-1 bg-red-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default PostsPage;
