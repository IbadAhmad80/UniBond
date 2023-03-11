/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        MONGODB_URI:
            "",
        DB_NAME: "UniBond",
        apiUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000" // development api
                : "https://uni-bond-app.herokuapp.com/", // production api
    },
    serverRuntimeConfig: {
        secret: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, IT CAN BE ANY STRING",
    },
};

module.exports = nextConfig;
