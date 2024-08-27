<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import List, { Item, Graphic, Text } from '@smui/list';

	import { capitalize } from '$lib/utils/format';

	let searchQuery = '';
	let results = [];
	let isLoading = false;
	let showMenu = false;
	let searchTimeout;

	const searchFilms = async (query) => {
		isLoading = true;
		try {
			const response = await fetch(`/api/v1/films/search?q=${encodeURIComponent(query)}`);
			if (!response.ok) throw new Error('Network response was not ok');
			results = await response.json();
		} catch (error) {
			console.error('Error fetching search results:', error);
			results = [];
		} finally {
			isLoading = false;
			showMenu = true;
		}
	};

	const debouncedSearch = (query) => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => searchFilms(query), 300);
	};

	$: if (searchQuery) {
		debouncedSearch(searchQuery);
	} else {
		results = [];
		showMenu = false;
	}

	const handleKeyup = (event) => {
		if (event.key === 'Escape') {
			showMenu = false;
		}
	};

	const handleClickOutside = (event) => {
		if (showMenu && !event.target.closest('.search-container')) {
			showMenu = false;
		}
	};

	const handleItemClick = (id) => {
		searchQuery = '';
		goto(`/films/${id}`);
		showMenu = false;
	};

	let searchBarWidth;

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				searchBarWidth = entry.contentRect.width;
			}
		});

		const searchBar = document.querySelector('.search-bar');
		if (searchBar) {
			resizeObserver.observe(searchBar);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="search-container">
	<Textfield
		class="search-bar"
		variant="outlined"
		label="Search..."
		bind:value={searchQuery}
		on:keyup={handleKeyup}
	>
		<Icon class="material-icons" slot="leadingIcon">search</Icon>
	</Textfield>

	{#if showMenu}
		<div class="search-results" style="width: {searchBarWidth}px">
			{#if isLoading}
				<div class="loading">Loading...</div>
			{:else if results.length > 0}
				<List>
					{#each results as result}
						<Item on:SMUI:action={() => handleItemClick(result.film_id)}>
							<Graphic>
								<img
									src={result.poster_path
										? `https://image.tmdb.org/t/p/w92${result.poster_path}`
										: '/placeholder-poster.jpg'}
									alt={result.title}
									class="poster"
								/>
							</Graphic>
							<Text>{capitalize(result.title)}</Text>
						</Item>
					{/each}
				</List>
			{:else}
				<div class="no-results">No results found</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
		width: 100%;
		max-width: 300px;
	}

	:global(.search-bar) {
		width: 100%;
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		background: white;
		border: 1px solid #ccc;
		border-top: none;
		max-height: 300px;
		overflow-y: auto;
		z-index: 1000;
	}

	.poster {
		width: 46px;
		height: 69px;
		object-fit: cover;
		border-radius: 4px;
	}

	.loading,
	.no-results {
		padding: 10px;
		text-align: center;
	}

	:global(.mdc-list) {
		padding: 0;
	}

	:global(.mdc-list-item) {
		height: auto;
		padding: 8px;
	}

	:global(.mdc-list-item__graphic) {
		margin-right: 16px;
	}
</style>
