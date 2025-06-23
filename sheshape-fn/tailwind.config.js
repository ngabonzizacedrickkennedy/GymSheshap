/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: "#0B5B47", // Dark green
          50: "#E6F0ED",
          100: "#CCE0DB",
          200: "#99C2B7",
          300: "#66A392",
          400: "#33856E",
          500: "#0B5B47", // Primary
          600: "#095740",
          700: "#074835",
          800: "#05342A",
          900: "#021A15",
          950: "#010D0A",
        },
        secondary: {
          DEFAULT: "#2FA572", // Lighter green
          50: "#E8F7F0",
          100: "#D0EFE0",
          200: "#A2DFC2",
          300: "#73CFA3",
          400: "#45C085",
          500: "#2FA572", // Secondary
          600: "#299A67",
          700: "#228056",
          800: "#1B6545",
          900: "#0D3322",
          950: "#071A11",
        },
        accent1: {
          DEFAULT: "#FFAE9C", // Peach
          50: "#FFF5F2",
          100: "#FFEBE5",
          200: "#FFD6CA",
          300: "#FFC2B0",
          400: "#FFAE9C", // Accent
          500: "#FF8F77",
          600: "#FF6849",
          700: "#FF411A",
          800: "#EB2100",
          900: "#B81A00",
          950: "#5C0D00",
        },
        accent2: {
          DEFAULT: "#D7BDE2", // Lavender
          50: "#F9F5FB",
          100: "#F4EBF7",
          200: "#E8D8EF",
          300: "#DCC4E6",
          400: "#D7BDE2", // Accent
          500: "#C59FD5",
          600: "#B282C8",
          700: "#9F64BB",
          800: "#8746AA",
          900: "#6A3784",
          950: "#482559",
        },
        // Neutral colors
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        cursive: ['var(--font-dancing-script)', 'cursive']
      },
      fontSize: {
        // Increase the base size of all text
        'base': '1rem',      // 16px (unchanged, but serves as our base)
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'lg': '1.125rem',    // 18px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        '3xl': '1.875rem',   // 30px
        '4xl': '2.5rem',     // 40px
        '5xl': '3.5rem',     // 56px
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config;