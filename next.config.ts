import type { NextConfig } from "next";

// El límite por defecto de Server Actions es 1MB, insuficiente para fotos de
// iPhone (2-5MB). 6MB cubre AVATAR_MAX_BYTES (5MB) + el overhead de multipart.
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  // El service worker nunca se puede cachear: si queda una versión vieja
  // guardada, el push se sigue mostrando con el handler anterior para siempre.
  // `Service-Worker-Allowed` habilita el scope "/" que el registro pide.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
