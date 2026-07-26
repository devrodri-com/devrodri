/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A84FF",       // Azul elegante estilo Apple 💙
        "primary-dark": "#005FCC", // Variante más intensa para hover o énfasis
        "primary-on-light": "#005FCC",
        "primary-on-light-hover": "#0057B8",
        secondary: "#e5f0ff",     // Azul súper claro (ideal para fondos sutiles)
        neutral: "#f9fafb",       // Fondo neutro muy limpio (casi blanco)
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Cambiado a Inter (minimalista, clara y elegante)
      },
    },
  },
  plugins: [],
};