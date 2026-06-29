/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#00A896",
          "primary-content": "#ffffff",
          secondary: "#9AF5EC",
          "secondary-content": "#082A26",
          accent: "#4A6B69",
          "accent-content": "#ffffff",
          neutral: "#f0fafa",
          "neutral-content": "#ffffff",
          "base-100": "#E6FDFA",
          "base-200": "#ffffff",
          "base-300": "#C0EDE9",
          "base-content": "#162B28",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#00E5CC",
          "primary-content": "#001A16",
          secondary: "#0A3D38",
          "secondary-content": "#B2FFF5",
          accent: "#eeeeee",
          "accent-content": "#cfd8e3",
          neutral: "#1A2D2B",
          "neutral-content": "#00E5CC",
          "base-100": "#1A2826",
          "base-200": "#0D1918",
          "base-300": "#253432",
          "base-content": "#d2d2d2",
          info: "#3b8dcb",
          success: "#2c907f",
          warning: "#c47f30",
          error: "#b2584e",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--s))",
            "--tooltip-text-color": "oklch(var(--sc))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        xl: "0 0 15px -5px rgb(0 229 204)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      screens: {
        lg: "800px", // Change to 800 from 1024
        laptop: "1024px",
      },
    },
  },
};
