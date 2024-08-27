<script>
	import Button, { Label } from '@smui/button';

	import { capitalize } from '$lib/utils/format';
	import DVDTitle from '$lib/components/DVDTitle.svelte';
	import { routeToPage } from '$lib/utils/common';

	export let dvdId = 0;
	export let title = 'Movie Title';
	export let description = 'Movie description goes here.';
	export let imageUrl = 'https://via.placeholder.com/300x200';
	export let releaseYear = '2023';
	export let rentalRate = '3.99';
	export let rentalDuration = '48 hours';

	function rentNow() {
		// Implement rent functionality
		console.log(`Renting ${title}`);
	}
</script>

<div class="dvd-details">
	<div class="content-wrapper">
		<div class="dvd-title-wrapper">
			<DVDTitle hideTitle {dvdId} {title} {description} {imageUrl} {releaseYear} />
		</div>
		<div class="details-wrapper">
			<h6>{capitalize(title)}</h6>
			<p class="description">{description}</p>

			<div class="rental-info">
				<p><strong>Rental Rate:</strong> ${rentalRate}</p>
				<p><strong>Rental Duration:</strong> {rentalDuration}</p>
			</div>

			<div class="button-group">
				<Button on:click={() => routeToPage(`films/${dvdId}`)} variant="outlined" color="secondary">
					<Label style="margin-right:10px">Details</Label>
					<i class="material-icons">info</i>
				</Button>

				<Button on:click={rentNow} variant="raised" color="secondary">
					<Label style="margin-right:10px">Rent Now</Label>
					<i class="material-icons">add_shopping_cart</i>
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.dvd-details {
		padding: 20px;
		border-radius: 8px;
		width: 450px;
		background: rgba(2, 135, 195, 0.7);
	}

	.content-wrapper {
		display: flex;
		align-items: flex-start;
	}

	.dvd-title-wrapper {
		flex-shrink: 0;
	}

	.details-wrapper {
		flex-grow: 1;
		text-align: start;
		margin-left: 16px;
	}

	h6 {
		margin-top: 0;
		margin-bottom: 10px;
		color: var(--mdc-theme-secondary);
	}

	.description {
		margin-bottom: 20px;
	}

	.rental-info {
		margin-bottom: 20px;
	}

	.rental-info p {
		margin: 5px 0;
	}

	.button-group {
		display: flex;
		gap: 10px;
	}

	:global(.dvd-details .mdc-button) {
		margin-top: 10px;
	}

	:global(.mdc-button--outlined) {
		border: 1px solid var(--mdc-theme-secondary) !important;
	}

	@media (max-width: 768px) {
		.content-wrapper {
			flex-direction: column;
		}

		.dvd-title-wrapper {
			width: 100%;
			margin-bottom: 20px;
		}
	}
</style>
