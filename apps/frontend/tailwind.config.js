module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'tamil': ['Noto Sans Tamil', 'sans-serif'],
      },
      colors: {
        // Service colors
        electrical: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        plumbing: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#06b6d4',
          600: '#0891b2',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}