<script lang="js">
	import { onDestroy, onMount } from 'svelte';
	import { mdiFileDocument, mdiPalette } from '@mdi/js';
	import TinyGesture from 'tinygesture';
	import { assets } from '$app/paths';
	import { page } from '$app/stores';

	import { Row, Section, Title } from '@smui/top-app-bar';
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
		if (mainContent) {
			mainContentGesture = new TinyGesture(mainContent, {
				mouseSupport: false
			});
			let touchStartX = 0;
			mainContentGesture.on('panstart', () => {
				touchStartX = mainContentGesture.touchStartX;
			});
			mainContentGesture.on('swiperight', () => {
				if (touchStartX <= 40) {
					drawerOpen = true;
				}
			});
		}

		if (drawer) {
			drawerGesture = new TinyGesture(drawer.getElement(), {
				mouseSupport: false
			});
			drawerGesture.on('swipeleft', () => {
				drawerOpen = false;
			});
		}
	});

	onDestroy(() => {
		if (mainContentGesture) {
			mainContentGesture.destroy();
		}
		if (drawerGesture) {
			drawerGesture.destroy();
		}
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

<!-- <TopAppBar>
	<Row>
		<Section>
			{#if miniWindow}
				<IconButton class="material-icons" on:click={() => (drawerOpen = !drawerOpen)}
					>menu</IconButton
				>
			{/if}
			<Title
				tag="a"
				href="/"
				on:click={() => (activeSection = undefined)}
				style={miniWindow ? 'padding-left: 0;' : ''}
			>
				Rent-A-Vid
			</Title>
		</Section>
		<Section align="end" toolbar style="color: var(--mdc-on-surface, #000);">
			<div style="display: inline-block;">
				<IconButton
					on:click={() => themeMenu.setOpen(true)}
					title="Pick a theme or toggle dark mode."
				>
					<Icon tag="svg" viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiPalette} />
					</Icon>
				</IconButton>
				<Menu bind:this={themeMenu}>
					<List>
						<SelectionGroup>
							<Item on:SMUI:action={() => (lightTheme = null)} selected={lightTheme == null}>
								<SelectionGroupIcon>
									<i class="material-icons">check</i>
								</SelectionGroupIcon>
								<Text>Follow System</Text>
							</Item>
							{#each [{ label: 'Light', value: true }, { label: 'Dark', value: false }] as item}
								<Item
									on:SMUI:action={() => (lightTheme = item.value)}
									selected={lightTheme === item.value}
								>
									<SelectionGroupIcon>
										<i class="material-icons">check</i>
									</SelectionGroupIcon>
									<Text>{item.label}</Text>
								</Item>
							{/each}
						</SelectionGroup>
						<Separator />
						<SelectionGroup>
							<Item on:SMUI:action={() => (theme = null)} selected={theme == null}>
								<SelectionGroupIcon>
									<i class="material-icons">check</i>
								</SelectionGroupIcon>
								<Text>Svelte</Text>
							</Item>
							{#each themes as item}
								<Item on:SMUI:action={() => (theme = item.value)} selected={theme === item.value}>
									<SelectionGroupIcon>
										<i class="material-icons">check</i>
									</SelectionGroupIcon>
									<Text>{item.label}</Text>
								</Item>
							{/each}
						</SelectionGroup>
						<Separator />
						<Item tag="a" href="/THEMING.md" style="color: inherit;">
							<Text>Learn about theming</Text>
						</Item>
						<Item
							tag="a"
							href="https://github.com/hperrin/svelte-material-ui/tree/master/packages/site/src/theme"
							target="_blank"
							rel="noreferrer noorigin"
							style="color: inherit;"
						>
							<Text>See the theme source</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</Section>
	</Row>
</TopAppBar> -->

<TopAppBar />
<AppContent>
	<main class="demo-main-content" bind:this={mainContent}>
		<slot />
	</main>
</AppContent>

<style>
	@media (max-width: 720px) {
		* > :global(.hide-initial-small) {
			display: none;
		}
	}
</style>
