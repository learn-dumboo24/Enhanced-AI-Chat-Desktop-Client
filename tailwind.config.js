/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/renderer/index.html",
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
