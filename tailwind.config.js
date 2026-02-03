import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'slide-down': 'slide-down 0.5s ease-out forwards',
                'disappear': 'disappear 0.5s ease-in forwards',
            },
            keyframes: {
                'slide-down': {
                '0%': { transform: 'translateY(-100%)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'disappear': {
                '0%': { opacity: '0.75' },
                '100%': { opacity: '0' },
                },
            },
        },
    },

    plugins: [forms],
};
