import type { MetadataRoute } from "next";

const description =
  "Llevá las cuentas con tus amigos: deudas, pagos y juntadas, sin rollos.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DespuésTePaso",
    short_name: "DespuésTePaso",
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafaf9",
    theme_color: "#7c3aed",
    lang: "es-AR",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
