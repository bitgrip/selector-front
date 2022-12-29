import type { UserConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./setupTest.js']
	}
};

export default config;
