export default function manifest() {
  return {
    name: "ICS-ASTRA",
    short_name: "ICS-ASTRA",
    description: "ICS Alumni System for Tracking Relations and Advancement",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/astra-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}