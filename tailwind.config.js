/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./composables/**/*.{js,ts}`,
    `./plugins/**/*.{js,ts}`,
    `./utils/**/*.{js,ts}`,
    `./App.{js,ts,vue}`,
    `./app.{js,ts,vue}`,
    `./Error.{js,ts,vue}`,
    `./error.{js,ts,vue}`,
    `./app.config.{js,ts}`
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          'primary': {
            DEFAULT: '#3490dc',
            '100': '#b3d9ff',
            '200': '#82cfff',
            '300': '#4ea8ff',
            '400': '#1890ff',
            '500': '#096dd9',
            '600': '#064582',
            '700': '#04273d',
            '800': '#03152c',
            '900': '#010a12',
          },
          'background': {
            DEFAULT: '#f9fafb',
            '100': '#f5f5f5',
            '200': '#e9ecef',
            '300': '#dee2e6',
            '400': '#dfe6e9',
            '500': '#e4e7ed',
            '600': '#dae0e5',
            '700': '#d1d5db',
            '800': '#c7d2e7',
            '900': '#b3b8d5',
          },
          'text': {
            DEFAULT: '#333333',
            '100': '#666666',
            '200': '#888888',
            '300': '#999999',
            '400': '#cccccc',
            '500': '#e6e6e6',
            '600': '#f2f2f2',
            '700': '#ffffff',
          },
          'border': {
            DEFAULT: '#e0e3eb',
            '100': '#d1d5db',
            '200': '#c7d2e7',
            '300': '#b3b8d5',
            '400': '#a0a5aa',
            '500': '#9ca3af',
            '600': '#8d96b6',
            '700': '#7b839d',
            '800': '#696988',
            '900': '#5a6178',
          },
        }
      }
    },
  },
  plugins: [],
}

