/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sidebar': '#171717',
                'main': '#212121',
                'input': '#2f2f2f',
                'message-user': '#2f2f2f',
                'border': '#424242',
                'hover': '#2f2f2f',
            },
        },
    },
    plugins: [],
}
