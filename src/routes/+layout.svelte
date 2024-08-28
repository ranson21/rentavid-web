<script lang="js">
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import { page } from '$app/stores';
	import 'normalize.css';

	import ShoppingCartLoader from '$lib/components//Loader.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let mainContent;
	let miniWindow = false;
	let drawerOpen = false;

	let lightTheme = null;
	let previousPagePath = undefined;
	$: if (mainContent && previousPagePath !== $page.url.pathname) {
		drawerOpen = false;
		const hashEl = window.location.hash && document.querySelector(window.location.hash);
		const top = (hashEl && hashEl.offsetTop) || 0;
		mainContent.scrollTop = top;
		previousPagePath = $page.url.pathname;
	}

	let assetsLoaded = false;

	onMount(async () => {
		setTimeout(setMiniWindow, 0);
		loadSMUIStyles();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		assetsLoaded = true;
	});

	function setMiniWindow() {
		if (typeof window !== 'undefined') {
			miniWindow = window.innerWidth < 720;
		}
	}

	function loadSMUIStyles() {
		const head = document.head;
		const smuiStylesheet = document.createElement('link');
		smuiStylesheet.rel = 'stylesheet';
		smuiStylesheet.href = `${assets}/smui.css`;
		head.appendChild(smuiStylesheet);

		const siteStylesheet = document.createElement('link');
		siteStylesheet.rel = 'stylesheet';
		siteStylesheet.href = `${assets}/site.css`;
		head.appendChild(siteStylesheet);

		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			const smuiDarkStylesheet = document.createElement('link');
			smuiDarkStylesheet.rel = 'stylesheet';
			smuiDarkStylesheet.href = `${assets}/smui-dark.css`;
			head.appendChild(smuiDarkStylesheet);

			const siteDarkStylesheet = document.createElement('link');
			siteDarkStylesheet.rel = 'stylesheet';
			siteDarkStylesheet.href = `${assets}/site-dark.css`;
			head.appendChild(siteDarkStylesheet);
		}
	}
</script>

<svelte:window on:resize={setMiniWindow} />

<svelte:head>
	<!-- It Matters -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/itmatters@2.0.1/index.css" />
	<style>
		body {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
		}
		main {
			flex: 1 0 auto;
		}
	</style>
</svelte:head>

{#if !assetsLoaded}
	<ShoppingCartLoader size={200} />
{:else}
	<TopAppBar />
	<div class="toolbar" />
	<Snackbar />
	<main bind:this={mainContent}>
		<slot />
	</main>
	<Footer />
{/if}

<style>
	@media (max-width: 720px) {
		* > :global(.hide-initial-small) {
			display: none;
		}
	}

	:global(.app-content) {
		margin-top: 48px;
	}

	.toolbar {
		height: 64px;
	}
</style>
