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

	// Pagination variables
	let currentPage = 1;
	let itemsPerPage = 25;
	let totalItems = 0;
	let totalPages = 0;

	onMount(async () => {
		// Fetch languages from API
		const res = await fetch('/api/v1/languages');
		languages = (await res.json()).map((l) => l.name);

		// Fetch DVDs from API (replace with your API logic)
		await fetchDvds();
	});

	async function fetchDvds() {
		// Replace with your API call to fetch DVDs based on filters, sort order, and pagination
		// Example:
		const res = await fetch(
			`/api/v1/films?releaseYear=${releaseYear}${selectedLanguages.length ? '&languages=' + selectedLanguages.join(',') : ''}&rentalRate=${rentalRate}${selectedRating.length ? '&rating=' + selectedRating.join(',') : ''}&sort=${sortBy}&page=${currentPage}&limit=${itemsPerPage}`
		);
		const data = await res.json();
		console.log('data', data);
		dvds = data.films;
		totalItems = data.pagination.total_items;
		totalPages = Math.ceil(totalItems / itemsPerPage);
	}

	// Reactive declarations to trigger fetchDvds
	$: sortByTrigger = sortBy;
	$: releaseYearTrigger = releaseYear;
	$: selectedLanguagesTrigger = selectedLanguages;
	$: rentalRateTrigger = rentalRate;
	$: selectedRatingTrigger = selectedRating;
	$: currentPageTrigger = currentPage;

	// Single reactive statement to call fetchDvds when any input changes
	$: {
		sortByTrigger;
		releaseYearTrigger;
		selectedLanguagesTrigger;
		rentalRateTrigger;
		selectedRatingTrigger;
		currentPageTrigger;
		fetchDvds();
	}

	let isFilterOpen = true;
	let isSortOpen = false;

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}
</script>

<div class="container">
	<h4>Browse DVDs</h4>
	<div class="filter-panel">
		<div style="position: relative; z-index: 1000;">
			<Accordion class="filter-panel-content">
				<Panel bind:open={isSortOpen}>
					<Header
						>Sorting <IconButton slot="icon" toggle pressed={isSortOpen}>
							<Icon class="material-icons" on>expand_less</Icon>
							<Icon class="material-icons">chevron_right</Icon>
						</IconButton></Header
					>
					<Content>
						<div class="sort-select-wrapper">
							<Select bind:value={sortBy} label="Sort By" class="sort-select">
								{#each sortOptions as option}
									<Option value={option.value}>{option.label}</Option>
								{/each}
							</Select>
						</div>
					</Content>
				</Panel>
			</Accordion>
		</div>
		<div style="position: relative; z-index: 1;">
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
							<Slider min={1900} max={2023} bind:value={releaseYear} discrete tickMarks />
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

	<!-- Pagination controls -->
	<div class="pagination">
		<Button on:click={() => goToPage(1)} disabled={currentPage === 1}>
			<Icon class="material-icons">first_page</Icon>
		</Button>
		<Button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
			<Icon class="material-icons">chevron_left</Icon>
		</Button>
		<span>Page {currentPage} of {totalPages}</span>
		<Button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
			<Icon class="material-icons">chevron_right</Icon>
		</Button>
		<Button on:click={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
			<Icon class="material-icons">last_page</Icon>
		</Button>
	</div>
</div>

<style>
	.sort-select-wrapper {
		position: relative;
		z-index: 1000;
	}

	:global(.sort-select) {
		position: relative;
		z-index: 1000 !important;
	}

	:global(.mdc-select__menu) {
		position: absolute;
		z-index: 1001 !important;
	}

	:global(.mdc-menu-surface) {
		z-index: 1002 !important;
	}

	:global(.mdc-accordion) {
		position: relative;
		z-index: 1;
	}

	:global(.sort-select) {
		width: 100%;
	}

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
	.pagination {
		grid-column: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 50px 0;
		gap: 10px;
	}

	.pagination span {
		margin: 0 10px;
	}
</style>
