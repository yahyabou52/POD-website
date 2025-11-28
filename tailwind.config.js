/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Luxury Palette
        onyx: '#0D0D0D',        // deep soft black
        carbon: '#1A1A1A',      // very dark gray
        graphite: '#2B2B2B',    // neutral dark gray
        mist: '#EDEDED',        // soft clean gray
        gold: '#D4AF37',        // premium gold accent
        royal: '#3A6DFF',       // modern premium blue
        mint: '#4ADE80',        // success
        amber: '#FBBF24',       // warning
        velvet: '#EF4444',      // soft red
        
        // Existing Colors
        primary: {
          DEFAULT: 'hsl(222.2, 47.4%, 11.2%)',
          50: 'hsl(210, 40%, 98%)',
          100: 'hsl(210, 40%, 96.1%)',
          200: 'hsl(214.3, 31.8%, 91.4%)',
          300: 'hsl(212.7, 26.8%, 83.9%)',
          400: 'hsl(215, 20.2%, 65.1%)',
          500: 'hsl(215.4, 16.3%, 46.9%)',
          600: 'hsl(215.3, 19.3%, 34.5%)',
          700: 'hsl(215.3, 25%, 26.7%)',
          800: 'hsl(217.2, 32.6%, 17.5%)',
          900: 'hsl(222.2, 47.4%, 11.2%)',
          950: 'hsl(229, 84%, 5%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        secondary: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(222.2, 47.4%, 11.2%)'
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(210, 40%, 98%)'
        },
        muted: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)'
        },
        accent: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(222.2, 47.4%, 11.2%)'
        },
        border: 'hsl(214.3, 31.8%, 91.4%)',
        input: 'hsl(214.3, 31.8%, 91.4%)',
        ring: 'hsl(222.2, 84%, 4.9%)',
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 84%, 4.9%)',
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