import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = (assetInfo.name || '').split('.').at(-1);
						if (extType === 'css') return `_astro/style.[hash][extname]`;
						else return '_astro/[name].[hash][extname]';
					},
				},
			},
		},
	},
	site: 'https://erisa.uk',
	integrations: [mdx()],
	build: {
		format: 'file',
	},
});
