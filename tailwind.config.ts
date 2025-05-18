import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "move-left": "moveLeft 1s ease-in-out forwards",
        "fade-in": "fadeIn 1s ease-in-out forwards",
        "move-right": "moveRight 1s ease-in-out forwards",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        "share-tech": ["Share Tech Mono", "sans-serif"],
        bitterslide: ["BitterSlide EvelWhite", "sans-serif"],
        grandiflora: ["Grandiflora One", "sans-serif"],
        "vintage-glory": ["Vintage Glory", "sans-serif"],
        "cairo-play": ["Cairo Play", "sans-serif"],
        afacad: ["Afacad", "sans-serif"],
      },

      keyframes: {
        moveLeft: {
          "0%": { transform: "translateX(53%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        moveRight:{  
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(0)" },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
