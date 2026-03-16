// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-11-24',
	devtools: { enabled: true },
	vite: {
		server: {
			allowedHosts: true,
		},
	},
	app: {
		head: {
			title: 'Twitch Resizer',
		},
	},
	modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/color-mode'],
	css: ['~/styles/global.scss'],
	nitro: {
		esbuild: {
			options: {
				target: 'esnext',
			},
		},
	},
	// https://fonts.nuxt.com/get-started/configuration
	fonts: {
		defaults: {
			weights: ['100 700'],
			styles: ['normal', 'italic'],
		},
		// Optical size, fill, grade variable axes seem to not be supported
		// families: [
		// 	{
		// 		name: 'Material Symbols Outlined',
		// 		provider: 'googleicons',
		// 		fallbacks: [],
		// 		weights: ['100 700'],
		// 	},
		// ],
	},
	// https://color-mode.nuxtjs.org/usage/configuration
	colorMode: {
		preference: 'system',
		fallback: 'dark',
		dataValue: 'bs-theme',
	},
});
