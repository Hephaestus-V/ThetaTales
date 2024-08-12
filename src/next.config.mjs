/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
       config.resolve.alias.canvas = false;
      config.resolve.fallback = {

          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped.
          ...config.resolve.fallback,

          fs: false, // the solution
      };
    
       return config;
     },
};


export default nextConfig;