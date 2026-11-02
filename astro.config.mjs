// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Pages are prerendered (see `export const prerender = true`); the Worker (src/worker.ts) routes by hostname.
	output: 'server',
	adapter: cloudflare(),
	fonts: [
		// Mouldy Shoe site (src/pages/mouldy_shoe). Only pages that render <Font /> load it.
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/mouldy_shoe/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/mouldy_shoe/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
