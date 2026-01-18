/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ee7519',
          600: '#df5b10',
          700: '#b94410',
          800: '#933715',
          900: '#773014',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.8',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h2: {
              marginTop: '2em',
              marginBottom: '1em',
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.3',
            },
            h3: {
              marginTop: '1.75em',
              marginBottom: '0.75em',
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.5em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeftColor: '#ee7519',
              backgroundColor: '#fef7ee',
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            table: {
              fontSize: '0.875rem',
              width: '100%',
              overflowX: 'auto',
              display: 'block',
            },
            img: {
              borderRadius: '0.5rem',
              marginTop: '2em',
              marginBottom: '2em',
            },
            a: {
              color: '#df5b10',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: '#b94410',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
