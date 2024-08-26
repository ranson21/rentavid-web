<script>
	import TopAppBar, { Row, Section } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Logo from './Logo.svelte'; // Assume we have a Logo component
	import { writable } from 'svelte/store';

	let searchQuery = '';

	// Create a store for the current route
	const currentRoute = writable('/');

	// Function to update the current route
	function updateRoute(path) {
		currentRoute.set(path);
	}

	// Array of navigation items
	const navItems = [
		{ path: '/', label: 'Home' },
		{ path: '/browse', label: 'Browse' },
		{ path: '/stores', label: 'Stores' }
	];
</script>

<TopAppBar variant="fixed">
	<Row>
		<Section>
			<Logo />
		</Section>

		<Section class="search-bar-container">
			<Textfield class="search-bar" variant="outlined" label="Search..." bind:value={searchQuery}>
				<Icon class="material-icons" slot="leadingIcon">search</Icon>
			</Textfield>
		</Section>

		<Section align="end">
			<div class="nav-links">
				{#each navItems as item}
					<div class="mdc-typography--button">
						<a
							href={item.path}
							class:active={$currentRoute === item.path}
							on:click|preventDefault={() => updateRoute(item.path)}
						>
							{item.label}
						</a>
					</div>
				{/each}
			</div>
			<div class="separator"></div>
			<IconButton class="material-icons shopping-cart-button">shopping_cart</IconButton>
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
		border: 0.25px solid white;
		border-radius: 5px;
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
