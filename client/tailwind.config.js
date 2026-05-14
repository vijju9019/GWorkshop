/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          red: '#ea4335',
          yellow: '#fbbc05',
          green: '#34a853',
          gray: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#bdc1c6',
            500: '#9aa0a6',
            600: '#80868b',
            700: '#5f6368',
            800: '#3c4043',
            900: '#202124',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'google': '8px',
      },
      boxShadow: {
        'google': '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
        'google-hover': '0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149)',
      }
    },
  },
  plugins: [],
}
