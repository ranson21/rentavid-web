<script>
	import { onMount } from 'svelte';
	import { db } from '$lib/utils/db';
	import IconButton from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import RentButton from '$lib/components/RentButton.svelte';

	let updateTrigger = 0;

	let suggestedFilms = [];
	let total = 0;
	let error = null;

	$: total = cartItems.reduce((sum, item) => sum + item.rental_rate, 0);

	$: cartItemsCount = cartItems.length;

	let cartItems = [];

	async function fetchFilmDetails(id) {
		try {
			const response = await fetch(`api/v1/films/${id}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return await response.json();
		} catch (e) {
			console.error(`Error fetching film details for id ${id}:`, e);
			throw e;
		}
	}

	async function loadCartItems() {
		try {
			updateTrigger += 1;

			const items = await db.cart.toArray();
			const updatedItems = await Promise.all(
				items.map(async (item) => {
					const details = await fetchFilmDetails(item.dvdId);
					return { ...item, ...details };
				})
			);
			cartItems = updatedItems;
			console.log('Cart items after loading:', cartItems);
		} catch (e) {
			console.error('Error loading cart items:', e);
			error = 'Failed to load cart items. Please try again later.';
		}
	}

	async function removeFromCart(id) {
		try {
			await db.cart.where('dvdId').equals(id).delete();
			cartItems = cartItems.filter((item) => item.dvdId !== id);
			cartItems = [...cartItems];
		} catch (e) {
			console.error(`Error removing item with id ${id}:`, e);
			error = 'Failed to remove item. Please try again.';
		}
	}

	async function clearCart() {
		try {
			await db.cart.clear();
			cartItems = [];
		} catch (e) {
			console.error('Error clearing cart:', e);
			error = 'Failed to clear cart. Please try again.';
		}
	}

	async function checkout() {
		alert('Checkout functionality not implemented');
	}

	async function loadSuggestedFilms() {
		try {
			const firstItemId = cartItems.length ? cartItems[0].dvdId : 1;
			const response = await fetch(`api/v1/films/${firstItemId}/related`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			suggestedFilms = await response.json();
		} catch (e) {
			console.error('Error loading suggested films:', e);
			error = 'Failed to load suggested films. Please try again later.';
		}
	}

	async function handleRent() {
		try {
			await loadCartItems();
			await loadSuggestedFilms();
		} catch (e) {
			console.error('Error renting film:', e);
			error = 'Failed to rent film. Please try again.';
		}
	}

	onMount(() => {
		loadCartItems().then(() => loadSuggestedFilms());
	});

	$: {
		if (cartItems) {
			loadSuggestedFilms();
		}
	}
</script>

<main class="container">
	<div class="content-wrapper">
		<div class="cart-section">
			<h1 class="title">Shopping Cart ({cartItemsCount} items)</h1>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="cart-items">
				<div class="cart-items-container">
					{#each cartItems as item (item.film_id)}
						<div class="cart-item">
							<img src={item.poster_path} alt={item.title} class="item-image" />
							<div class="item-details">
								<h2 class="item-title">{item.title}</h2>
								<p class="item-description">{item.description}</p>
								<p class="item-rental"><b>Rental Rate:</b> ${item.rental_rate}</p>
								<p class="item-rental"><b>Rental Duration:</b> {item.rental_duration} days</p>
							</div>
							<IconButton
								class="remove-button material-icons"
								on:click={() => removeFromCart(item.film_id)}>close</IconButton
							>
						</div>
					{/each}
				</div>

				<div class="cart-total">
					<p>Total: ${total.toFixed(2)}</p>
				</div>

				<div class="cart-actions">
					<Button on:click={clearCart}>
						<i class="material-icons">delete_sweep</i>
						<Label>Clear Cart</Label>
					</Button>
					<Button color="secondary" variant="raised" on:click={checkout}>
						<i class="material-icons">shopping_cart_checkout</i>
						<Label>Checkout</Label>
					</Button>
				</div>
			</div>
		</div>

		<div class="suggested-films">
			<h2 class="suggested-title">Suggested Films</h2>
			<div class="suggested-films-list">
				{#each suggestedFilms as film (film.film_id)}
					<div class="suggested-item">
						<img src={film.poster_path} alt={film.title} class="suggested-item-image" />
						<div class="suggested-item-details">
							<h3 class="suggested-item-title">{film.title}</h3>
							<p class="suggested-item-description">{film.description}</p>
							<p class="suggested-item-rental">
								${film.rental_rate} for {film.rental_duration} days
							</p>
							<RentButton
								dvdId={film.film_id}
								title={film.title}
								on:rent={() => handleRent(film)}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	.error {
		color: red;
		margin-bottom: 1rem;
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.content-wrapper {
		display: flex;
	}

	.cart-section {
		width: 75%;
		padding-right: 1rem;
	}

	.title,
	.suggested-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.cart-items-container {
		margin-bottom: 1rem;
	}

	.cart-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.cart-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.cart-items {
		overflow-y: auto;
	}

	.item-image {
		width: auto;
		height: 220px;
		object-fit: cover;
		margin-right: 1rem;
	}

	.item-details {
		flex-grow: 1;
	}

	.item-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.item-description {
		font-size: 0.875rem;
		color: #4a5568;
		margin-bottom: 0.5rem;
	}

	.item-rental {
		margin-top: 0.5rem;
	}

	.remove-button {
		color: #e53e3e;
	}

	.cart-total {
		margin-top: 1rem;
		padding-top: 1rem;
		font-size: 1.25rem;
		font-weight: bold;
	}

	.cart-actions {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.suggested-films {
		width: 25%;
		padding-left: 1rem;
		border-left: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 64px);
	}

	.suggested-films-list {
		overflow-y: auto;
		flex-grow: 1;
	}

	.suggested-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.suggested-item:last-child {
		border-bottom: none;
	}

	.suggested-item-image {
		width: 70px;
		height: 105px;
		object-fit: cover;
		margin-right: 0.75rem;
		align-self: center;
	}

	.suggested-item-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.suggested-item-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.suggested-item-description {
		font-size: 0.8rem;
		color: #4a5568;
		margin-bottom: 0.25rem;
	}

	.suggested-item-rental {
		font-size: 0.8rem;
		margin-bottom: 0.5rem;
	}

	.material-icons {
		margin-right: 0.25rem;
	}

	.suggested-films-list::-webkit-scrollbar {
		width: 8px;
	}

	.suggested-films-list::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.suggested-films-list::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
	}

	.suggested-films-list::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
