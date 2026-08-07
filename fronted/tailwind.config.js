/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            aspectRatio: {
        '16/11': '16 / 11',
      },
            fontFamily: {
                'MariaValentina': ['Alex Brush', 'cursive'],
            },
        },
    },
    plugins: [],
}