import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			allow: ['static']
		},
		host: '127.0.0.1',
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				secure: false
			}
		}
	}
});
