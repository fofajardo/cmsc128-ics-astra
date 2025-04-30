/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        astraprimary: "#0E6CF3",
        astradark: "#0F59C3",
        astralight: "#64A4FF",
        astrablack: "#061A37",
        astragray: "#E4E5E5",
        astradarkgray: "#526683",
        astralightgray: "#99AFCE",
        astrawhite: "#FFFFFF",
        astradirtywhite: "#F3F5F9",
        astratintedwhite: "#EFF2FA",
        astragreen: "#02BB8F",
        astrared: "#E8403C",
        astrayellow: "#FF8C01",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      fontSize: {
        "5xl": "3rem", // Define custom size for text-5xl
      },
    },
  },
  plugins: [],
};
