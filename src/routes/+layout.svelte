<script lang="js">
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import { page } from '$app/stores';
	import 'normalize.css';

	import Snackbar from '$lib/components/Snackbar.svelte';
	import TopAppBar from '$lib/components/TopAppBar.svelte';

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

	onMount(() => setTimeout(setMiniWindow, 0));

	function setMiniWindow() {
		if (typeof window !== 'undefined') {
			miniWindow = window.innerWidth < 720;
		}
	}
</script>

<svelte:window on:resize={setMiniWindow} />

<svelte:head>
	<!-- SMUI Styles -->
	<link rel="stylesheet" href="{assets}/smui.css" />

	<!-- Site Styles -->
	<link rel="stylesheet" href="{assets}/site.css" />

	{#if lightTheme === false}
		<!-- SMUI Styles -->
		<link rel="stylesheet" href="{assets}/smui-dark.css" media="screen" />
	{:else if lightTheme !== true}
		<!-- SMUI Styles -->
		<link
			rel="stylesheet"
			href="{assets}/smui-dark.css"
			media="screen and (prefers-color-scheme: dark)"
		/>
		<!-- Site Styles -->
		<link
			rel="stylesheet"
			href="{assets}/site-dark.css"
			media="screen and (prefers-color-scheme: dark)"
		/>
	{/if}

	<!-- It Matters -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/itmatters@2.0.1/index.css" />
</svelte:head>

<TopAppBar />
<div class="toolbar" />
<Snackbar />
<main bind:this={mainContent}>
	<slot />
</main>

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
