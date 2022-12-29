/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['badge-ghost', 'badge-accent', 'badge-secondary', 'badge-secondary', 'badge-primary'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui'), require('@tailwindcss/typography')],
	darkMode: 'class'
};
