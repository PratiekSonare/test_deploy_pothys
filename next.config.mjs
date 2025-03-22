/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    experimental: {
      appDir: true, // Ensure Next.js app directory mode works
    },
};

export default nextConfig;
