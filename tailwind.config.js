/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // IMPORTANT: Make sure to set `styled` to true if you are defining custom theme objects.
    // However, the most common error is the way the themes are structured in the array.
    themes: [
      {
        // Theme 1: civicLight
        civicLight: {
          primary: "#2563EB",
          secondary: "#334155",
          accent: "#14B8A6",
          neutral: "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F1F5F9",
          // Adding required keys, if necessary, though they are usually defaulted
          "color-scheme": "light",
        },
      },
      {
        // Theme 2: civicDark
        civicDark: {
          primary: "#2563EB",
          secondary: "#CBD5E1",
          accent: "#14B8A6",
          neutral: "#0F172A",
          "base-100": "#0F172A",
          "base-200": "#020617",
          // Adding required keys
          "color-scheme": "dark",
        },
      },
    ],
    // Optional: Setting dark mode to respect your `data-theme` attribute (it already does by default with DaisyUI)
    // darkTheme: "civicDark",
  },
};
