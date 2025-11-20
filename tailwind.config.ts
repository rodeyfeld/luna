import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}'
	],
	plugins: [
		forms
	]
} satisfies Config;

export default config;