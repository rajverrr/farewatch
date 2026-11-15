/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        curved: ['Fredoka', 'Outfit', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        loot: {
          bg: '#FDFBF7',
          black: '#0A0A0A',
          white: '#FFFFFF',
          yellow: '#FFD600',
          mustard: '#EAB308',
          orange: '#FF6B00',
          green: '#00C853',
          lime: '#A3E635',
          pink: '#FF90E8',
          blue: '#2979FF',
          purple: '#7C4DFF',
          cream: '#FDFBF7',
          gray: '#E5E7EB',
          darkGray: '#1F2937',
        }
      },
      boxShadow: {
        'loot-xs': '2px 2px 0 #000000',
        'loot-sm': '3px 3px 0 #000000',
        'loot': '4px 4px 0 #000000',
        'loot-md': '5px 5px 0 #000000',
        'loot-lg': '6px 6px 0 #000000',
        'loot-xl': '8px 8px 0 #000000',
        'loot-2xl': '12px 12px 0 #000000',
      }
    },
  },
  plugins: [],
}
