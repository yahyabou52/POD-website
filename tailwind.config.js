/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary Color Palette (#F79A19)
        'primary': '#F79A19',
        'primary-light': '#FFC46D',
        'primary-dark': '#C46E00',
        'secondary': '#1F1F1F',
        'background': '#FAF8F5',
        'surface': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-on-primary': '#FFFFFF',
        'border': '#D9D4CE',
        
        // Additional brand colors
        'brand-gold': '#F79A19',
        'brand-gold-dark': '#C46E00',
        'brand-gold-light': '#FFC46D',
        'carbon': '#1F1F1F',
        'accent-orange': '#FF6B35',
        'accent-blue': '#5A85FF',
        'accent-emerald': '#18C29C',
        'bg-cream': '#FAF8F5',
        'bg-deep': '#121212',
        
        // Legacy names mapped to new palette
        onyx: '#1A1A1A',
        graphite: '#2B2B2B',
        mist: '#FAF8F5',
        gold: '#F79A19',
        royal: '#5A85FF',
        mint: '#18C29C',
        amber: '#FF6B35',
        velvet: '#EF4444',
        
        // Existing Colors
        primary: {
          DEFAULT: '#F79A19',
          light: '#FFC46D',
          dark: '#C46E00',
          50: '#FEF6EC',
          100: '#FDEDD9',
          200: '#FBDBB3',
          300: '#F9C98D',
          400: '#F7B767',
          500: '#F79A19',
          600: '#E08A10',
          700: '#C46E00',
          800: '#8F5409',
          900: '#663906',
          950: '#331D03',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#1F1F1F',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#FAF8F5',
          foreground: '#6B7280'
        },
        accent: {
          DEFAULT: '#FF6B35',
          foreground: '#FFFFFF'
        },
        border: '#D9D4CE',
        input: '#D9D4CE',
        ring: '#F79A19',
        background: '#FAF8F5',
        foreground: '#1A1A1A',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};