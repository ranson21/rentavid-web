<script>
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Logo from './Logo.svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { liveQuery } from 'dexie';
	import Badge from '@smui-extra/badge';

	import { db } from '$lib/utils/db';
	import { routeToPage } from '$lib/utils/common';
	import SearchBar from './SearchBar.svelte';
	import { onMount } from 'svelte';

	let searchQuery = '';

	// Create a derived store for the current route
	const currentRoute = derived(page, ($page) => $page.url.pathname);

	// Array of navigation items
	const navItems = [
		{ path: '/', label: 'Home' },
		{ path: '/browse', label: 'Browse' },
		{ path: '/stores', label: 'Stores' }
	];

	function navToCart() {
		routeToPage('cart');
	}

	$: cartItemsCount = 0;

	let items = liveQuery(() => db.cart.toArray());
	$: items.subscribe((item) => {
		cartItemsCount = item.length;
	});

	onMount(() => {
		console.log('navItems', navItems);
		console.log('$currentRoute', $currentRoute);
	});
</script>

<TopAppBar variant="fixed">
	<Row>
		<Section>
			<Logo />
		</Section>

		<Section class="search-bar-container">
			<SearchBar />
		</Section>

		<Section align="end">
			<div class="nav-links">
				{#each navItems as item}
					<div class="mdc-typography--button">
						<a
							href={item.path}
							class:active={$currentRoute === item.path ||
								($currentRoute === '/' && item.path === '/')}
						>
							{item.label}
						</a>
					</div>
				{/each}
			</div>
			<div class="separator"></div>
			<div class="cart-button-container">
				<IconButton class="material-icons shopping-cart-button" on:click={navToCart}
					>shopping_cart</IconButton
				>
				{#if cartItemsCount > 0}
					<Badge class="cart-badge">{cartItemsCount}</Badge>
				{/if}
			</div>
			<Button variant="raised" color="secondary">Login</Button>
		</Section>
	</Row>
</TopAppBar>

<style>
	:global(.search-bar) {
		width: 500px;
		margin-right: 16px;
		background-color: transparent !important;
	}

	:global(.search-bar-container) {
		justify-content: center !important;
	}

	:global(.shopping-cart-button) {
		color: #fff !important;
	}

	:global(.mdc-text-field--focused) {
		border: none;
		border-radius: 5px;
	}

	:global(.mdc-floating-label--float-above) {
		color: white !important;
	}

	.cart-button-container {
		position: relative;
		display: inline-block;
		margin-right: 16px;
	}
	:global(.smui-badge.smui-badge--align-top-end) {
		transform-origin: center;
		transform: translateX(50%) translateY(-20%) !important;
	}

	:global(.cart-badge) {
		position: absolute;
		top: 0;
		left: -8px;
		background-color: #ff4081 !important;
		color: white;
		border-radius: 50%;
		padding: 0;
		font-size: 12px;
		min-width: 25px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.separator {
		height: 24px;
		width: 1px;
		background-color: rgba(255, 255, 255, 0.3);
		margin: 0 16px;
	}

	.nav-links {
		display: flex;
		gap: 16px;
	}

	.nav-links a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding-bottom: 4px;
		border-bottom: 2px solid transparent;
		transition: border-bottom-color 0.3s ease;
	}

	.nav-links a.active {
		border-bottom-color: white;
	}
</style>
