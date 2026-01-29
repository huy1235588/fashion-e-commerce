import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    50: "var(--color-primary-50)",
                    100: "var(--color-primary-100)",
                    200: "var(--color-primary-200)",
                    300: "var(--color-primary-300)",
                    400: "var(--color-primary-400)",
                    500: "var(--color-primary-500)",
                    600: "var(--color-primary-600)",
                    700: "var(--color-primary-700)",
                    800: "var(--color-primary-800)",
                    900: "var(--color-primary-900)",
                },
                accent: {
                    50: "var(--color-accent-50)",
                    100: "var(--color-accent-100)",
                    500: "var(--color-accent-500)",
                    600: "var(--color-accent-600)",
                    700: "var(--color-accent-700)",
                },
                success: {
                    50: "var(--color-success-50)",
                    100: "var(--color-success-100)",
                    500: "var(--color-success-500)",
                    600: "var(--color-success-600)",
                    700: "var(--color-success-700)",
                },
                warning: {
                    50: "var(--color-warning-50)",
                    100: "var(--color-warning-100)",
                    500: "var(--color-warning-500)",
                    600: "var(--color-warning-600)",
                    700: "var(--color-warning-700)",
                },
                error: {
                    50: "var(--color-error-50)",
                    100: "var(--color-error-100)",
                    500: "var(--color-error-500)",
                    600: "var(--color-error-600)",
                    700: "var(--color-error-700)",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                display: ["var(--font-display)"],
            },
            fontSize: {
                xs: "var(--text-xs)",
                sm: "var(--text-sm)",
                base: "var(--text-base)",
                lg: "var(--text-lg)",
                xl: "var(--text-xl)",
                "2xl": "var(--text-2xl)",
                "3xl": "var(--text-3xl)",
                "4xl": "var(--text-4xl)",
                "5xl": "var(--text-5xl)",
                "6xl": "var(--text-6xl)",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
                "3xl": "var(--radius-3xl)",
            },
            boxShadow: {
                xs: "var(--shadow-xs)",
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                "2xl": "var(--shadow-2xl)",
            },
            transitionDuration: {
                fast: "var(--transition-fast)",
                normal: "var(--transition-normal)",
                slow: "var(--transition-slow)",
            },
            zIndex: {
                dropdown: "var(--z-dropdown)",
                sticky: "var(--z-sticky)",
                fixed: "var(--z-fixed)",
                "modal-backdrop": "var(--z-modal-backdrop)",
                modal: "var(--z-modal)",
                popover: "var(--z-popover)",
                tooltip: "var(--z-tooltip)",
                toast: "var(--z-toast)",
            },
            animation: {
                "fade-in": "fadeIn var(--transition-normal) var(--ease-out)",
                "fade-in-up": "fadeInUp var(--transition-slow) var(--ease-out)",
                "slide-in-right": "slideInRight var(--transition-slow) var(--ease-out)",
                shimmer: "shimmer 1.5s infinite",
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                fadeInUp: {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    from: { opacity: "0", transform: "translateX(20px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
