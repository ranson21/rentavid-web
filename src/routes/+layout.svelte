<script lang="js">
	import { onDestroy, onMount } from 'svelte';
	import { mdiFileDocument, mdiPalette } from '@mdi/js';
	import TinyGesture from 'tinygesture';
	import { assets } from '$app/paths';
	import { page } from '$app/stores';

	import Toolbar from '@smui/top-app-bar';
	import Drawer, { Content, Scrim, AppContent } from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import Menu, { SelectionGroup, SelectionGroupIcon } from '@smui/menu';
	import List, { Item, Text, Separator } from '@smui/list';
	import { Icon } from '@smui/common';
	import 'normalize.css';

	import TopAppBar from '$lib/TopAppBar.svelte';

	let drawer;
	let mainContent;
	let miniWindow = false;
	let drawerOpen = false;
	let drawerGesture;
	let mainContentGesture;

	const themes = [
		{ label: 'Material', value: 'material' },
		{ label: 'Fixation', value: 'fixation' },
		{ label: 'Metro', value: 'metro' },
		{ label: 'Unity', value: 'unity' }
	];
	let themeMenu;
	let lightTheme = null;
	let theme = null;

	const sections = [
		{
			name: 'Browse',
			route: '/',
			indent: 0
		},
		{
			name: 'Stores',
			route: '/',
			indent: 0
		}
	];

	$: activeSection = sections.find(
		(section) => 'route' in section && routesEqual(section.route ?? '', $page.url.pathname)
	);
	let previousPagePath = undefined;
	$: if (mainContent && previousPagePath !== $page.url.pathname) {
		drawerOpen = false;
		const hashEl = window.location.hash && document.querySelector(window.location.hash);
		const top = (hashEl && hashEl.offsetTop) || 0;
		mainContent.scrollTop = top;
		previousPagePath = $page.url.pathname;
	}

	onMount(() => setTimeout(setMiniWindow, 0));

	onMount(() => {
		// if (mainContent) {
		// 	mainContentGesture = new TinyGesture(mainContent, {
		// 		mouseSupport: false
		// 	});
		// 	let touchStartX = 0;
		// 	mainContentGesture.on('panstart', () => {
		// 		touchStartX = mainContentGesture.touchStartX;
		// 	});
		// 	mainContentGesture.on('swiperight', () => {
		// 		if (touchStartX <= 40) {
		// 			drawerOpen = true;
		// 		}
		// 	});
		// }
		// if (drawer) {
		// 	drawerGesture = new TinyGesture(drawer.getElement(), {
		// 		mouseSupport: false
		// 	});
		// 	drawerGesture.on('swipeleft', () => {
		// 		drawerOpen = false;
		// 	});
		// }
	});

	onDestroy(() => {
		// if (mainContentGesture) {
		// 	mainContentGesture.destroy();
		// }
		// if (drawerGesture) {
		// 	drawerGesture.destroy();
		// }
	});

	function routesEqual(a, b) {
		return (a.endsWith('/') ? a.slice(0, -1) : a) === (b.endsWith('/') ? b.slice(0, -1) : b);
	}

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
<AppContent>
	<main bind:this={mainContent}>
		<slot />
	</main>
</AppContent>

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
