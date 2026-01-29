
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#121212",
        accent: "#FFFFFF",
        "accent-contrast": "#000000",
        subtle: "#1C1C1E",
        text: "#F5F5F7",
        secondary: "#86868B",
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      fontSize: {
        'nano': ['clamp(0.75rem, 0.6vw, 0.9rem)', { lineHeight: '1.4', letterSpacing: '0.15em' }],
        'body-fluid': ['clamp(1.1rem, 1.2vw, 1.3rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'label-fluid': ['clamp(0.9rem, 0.8vw, 1rem)', { lineHeight: '1.2', letterSpacing: '0.22em' }],
        'h1-fluid': ['clamp(3.5rem, 6vw, 6.5rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'h2-fluid': ['clamp(2.5rem, 4vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'h3-fluid': ['clamp(1.5rem, 2vw, 2.2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'card-title-fluid': ['clamp(1.6rem, 1.8vw, 2rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        'widest-2x': '0.35em',
        'widest-3x': '0.5em',
      },
      maxWidth: {
        '8xl': '1440px',
      }
    },
  },
  plugins: [],
}
