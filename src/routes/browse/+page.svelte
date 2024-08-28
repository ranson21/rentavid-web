<script>
	import { onMount } from 'svelte';
	import Paper from '@smui/paper';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Chip, { Set, Text } from '@smui/chips';
	import Slider from '@smui/slider';
	import Select, { Option } from '@smui/select';
	import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';

	import { capitalize } from '$lib/utils/format';
	import { routeToPage } from '$lib/utils/common';
	import RentButton from '$lib/components/RentButton.svelte';

	let dvds = [];
	let languages = [];
	let selectedLanguages = [];
	let releaseYear = 2023;
	let rentalRate = 10;
	let selectedRating = [];
	let sortBy = 'title_asc';
	let sortOptions = [
		{ value: 'rating_desc', label: 'Rating (Desc)' },
		{ value: 'rating_asc', label: 'Rating (Asc)' },
		{ value: 'release_year_desc', label: 'Release Year (Desc)' },
		{ value: 'release_year_asc', label: 'Release Year (Asc)' },
		{ value: 'title_asc', label: 'Title (A-Z)' }
	];

	onMount(async () => {
		// Fetch languages from API
		const res = await fetch('/api/v1/languages');
		languages = (await res.json()).map((l) => l.name);
		console.log('languages', languages);
		// Fetch DVDs from API (replace with your API logic)
		await fetchDvds();
	});

	async function fetchDvds() {
		// Replace with your API call to fetch DVDs based on filters and sort order
		// Example:
		const res = await fetch(
			`/api/v1/films?releaseYear=${releaseYear}&languages=${selectedLanguages}&rentalRate=${rentalRate}&rating=${selectedRating}&sort=${sortBy}`
		);
		dvds = await res.json();
	}

	$: {
		fetchDvds();
	}

	let isFilterOpen = true;
	let isSortOpen = false;
</script>

<div class="container">
	<h4>Browse DVDs</h4>
	<div class="filter-panel">
		<Accordion class="filter-panel-content">
			<Panel bind:open={isSortOpen}>
				<Header
					>Sorting <IconButton slot="icon" toggle pressed={isSortOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">chevron_right</Icon>
					</IconButton></Header
				>
				<Content>
					<Select bind:value={sortBy} label="Sort By">
						{#each sortOptions as option}
							<Option value={option.value}>{option.label}</Option>
						{/each}
					</Select>
				</Content>
			</Panel>
		</Accordion>
		<Accordion>
			<Panel bind:open={isFilterOpen}>
				<Header
					>Filters <IconButton slot="icon" toggle pressed={isFilterOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">chevron_right</Icon>
					</IconButton></Header
				>
				<Content>
					<div class="filter-item">
						<h6>Release Year: {releaseYear}</h6>
						<div class="slider-labels">
							<span>{1900}</span>
							<span>{2023}</span>
						</div>
						<Slider min={1900} max={2023} bind:value={releaseYear} />
					</div>
					<div class="filter-item">
						<h6>Language:</h6>
						<Set chips={languages} let:chip bind:selected={selectedLanguages} filter>
							<Chip {chip}>
								<Text tabindex={0}>{chip}</Text>
							</Chip>
						</Set>
					</div>
					<div class="filter-item">
						<h6>Rental Rate: ${rentalRate}.00</h6>
						<div class="slider-labels">
							<span>$0.00</span>
							<span>$100.00</span>
						</div>
						<Slider min={0} max={100} bind:value={rentalRate} />
					</div>
					<div class="filter-item">
						<h6>Rating:</h6>
						<Set chips={['G', 'PG', 'PG-13', 'R']} let:chip bind:selected={selectedRating} filter>
							<Chip {chip}>
								<Text tabindex={0}>{chip}</Text>
							</Chip>
						</Set>
					</div>
				</Content>
			</Panel>
		</Accordion>
	</div>

	<div class="dvd-grid">
		{#each dvds as dvd}
			<Paper elevation={2} class="dvd-container">
				<img src={dvd.poster_path} alt={dvd.title} class="dvd-image" />
				<div class="dvd-details">
					<h6>{capitalize(dvd.title)} ({dvd.release_year})</h6>

					<div class="rental-info">
						<p class="suggested-item-rental">
							${dvd.rental_rate} for {dvd.rental_duration} days
						</p>
					</div>

					<div class="button-group">
						<Button
							on:click={() => routeToPage(`films/${dvd.film_id}`)}
							variant="outlined"
							color="secondary"
						>
							<Label style="margin-right:10px">Details</Label>
							<i class="material-icons">info</i>
						</Button>

						<RentButton dvdId={dvd.film_id} title={dvd.title} />
					</div>
				</div>
			</Paper>
		{/each}
	</div>
</div>

<style>
	:global(.dvd-container) {
		padding: 0 !important;
	}

	.dvd-details {
		padding-top: 0 !important;
		padding: 16px;
	}

	.dvd-image {
		height: 320px;
		width: 100%;
		object-fit: cover;
	}

	.container {
		margin: 0 300px;
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 20px;
		margin: 0 300px;
	}

	h4 {
		margin: 0;
		margin-top: 16px;
	}

	h5,
	h6 {
		margin: 0;
	}

	.filter-panel {
		grid-column: 1;
		gap: 16px;
	}

	:global(.filter-panel-content) {
		margin-bottom: 16px;
	}
	.dvd-grid {
		grid-column: 2;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}
</style>
