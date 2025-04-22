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
        'move-left':'moveLeft 1s ease-in',
        'fade-in':'fadeIn 1s ease-in-out',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'share-tech': ['Share Tech Mono', 'sans-serif'], 
        'bitterslide': ['BitterSlide EvelWhite', 'sans-serif'],
        'grandiflora': ['Grandiflora One', 'sans-serif'],
        'vintage-glory': ['Vintage Glory', 'sans-serif'],
        'cairo-play': ['Cairo Play', 'sans-serif'],
        'afacad': ['Afacad', 'sans-serif'],
      },

      keyframes: {
       
        moveLeft: {
          '0%': { transform: 'translateY(-20%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 'opacity(0)' },
          '100%': { opacity: 'opacity(1)' },
        }
        
      },
    },
    
  },
  plugins: [],
} satisfies Config;
