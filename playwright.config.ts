import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	timeout: 2000,
	testDir: './tests/',

	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	}
};

export default config;
