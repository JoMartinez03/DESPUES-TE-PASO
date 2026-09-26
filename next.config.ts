import type { NextConfig } from "next";

// El límite por defecto de Server Actions es 1MB, insuficiente para fotos de
// iPhone (2-5MB). 6MB cubre AVATAR_MAX_BYTES (5MB) + el overhead de multipart.
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
