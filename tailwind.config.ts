import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    primary: '#0B0B0E',
                    secondary: '#111114',
                    card: '#0F0F13',
                },
                purple: {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#9A6CFF',
                    600: '#7C4DFF',
                    700: '#6A3DF0',
                    800: '#5B2FE0',
                    900: '#4C1D95',
                    950: '#2E1065',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                float: 'float 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
                }
            }
        }
    }
}
