<script>
	import Button, { Label } from '@smui/button';
	import { liveQuery } from 'dexie';

	import { db } from '$lib/utils/db';
	import { capitalize } from '$lib/utils/format';
	import { snackbarStore } from '$lib/utils/snackbarStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function showSuccessMessage() {
		snackbarStore.show(`Added ${capitalize(title)} to cart`, 'success', 3000);
	}

	export let dvdId = 0;
	export let title = 'Movie Title';

	let rented = false;

	let items = liveQuery(() => db.cart.toArray());
	$: items.subscribe((item) => {
		if (item.find((dvd) => dvd.dvdId === dvdId)) {
			rented = true;
		}
	});

	async function rentNow() {
		// Implement rent functionality
		await db.cart.add({
			dvdId,
			title
		});
		rented = true;
		dispatch('rent', { film_id: dvdId });

		showSuccessMessage();
	}
</script>

<Button on:click={() => rentNow()} variant="raised" color="secondary" disabled={rented}>
	<Label style="margin-right:10px">{rented ? 'In Cart' : 'Rent Now'}</Label>
	<i class="material-icons" class:is-disabled={rented}>add_shopping_cart</i>
</Button>

<style>
	.is-disabled {
		display: none;
	}
	:global(.mdc-button) {
		margin-top: 10px;
	}

	:global(.mdc-button--outlined) {
		border: 1px solid var(--mdc-theme-secondary) !important;
	}
</style>
