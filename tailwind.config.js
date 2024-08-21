/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "./components/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '800px',
      'md': '700px',
      'lg': '1200px',
      'xl': '1800px',
      '2xl': '4000px'
    },
    extend: {
      colors: {
        sidebar: {
          0: '#F6F6F7',
          1: '#161518'
        },
        body: {
          0: '#FFFFFF',
          1: '#1B1A1F'
        },
        dim: {
          0: '#E2E2E3',
          1: '#2E2D32',
          2: '#66636A',
          3: '#97939D',
        },
        primary: {
          0: '#3D3A43',
          1: '#DEE1D8'
        },
      },
    },
  },
  plugins: [],
}

