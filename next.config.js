const path = require("path");
const { redirects } = require("./data/redirects");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["components"] = path.join(__dirname, "components");
    config.resolve.alias["context"] = path.join(__dirname, "context");
    config.resolve.alias["data"] = path.join(__dirname, "data");
    config.resolve.alias["lib"] = path.join(__dirname, "lib");
    config.resolve.alias["styles"] = path.join(__dirname, "styles");
    config.resolve.alias["middleware"] = path.join(__dirname, "middleware");

    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          issuer: /\.[jt]sx?$/,
          resourceQuery: /url/,
          type: "asset/resource",
        },
        {
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
      ],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  env: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_UPLOAD_PRESET: process.env.CLOUD_UPLOAD_PRESET,
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "poutinemania.com" }],
        destination: "https://poutinemania.ca/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.poutinemania.com" }],
        destination: "https://poutinemania.ca/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/profil/:id*",
        destination: "/users/:id*",
      },
    ];
  },
};
