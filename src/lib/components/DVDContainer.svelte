<script>
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';

	import DVDTitle from '$lib/components/DVDTitle.svelte';

	export let dvds = [
		{
			title: 'Inception',
			description: 'A thief enters dreams to steal secrets.',
			releaseYear: '2010'
		},
		{
			title: 'The Matrix',
			description: 'A computer programmer discovers a shocking truth.',
			releaseYear: '1999'
		},
		{
			title: 'Interstellar',
			description: 'Explorers travel through a wormhole in space.',
			releaseYear: '2014'
		},
		{
			title: 'Pulp Fiction',
			description: 'The lives of various characters intertwine.',
			releaseYear: '1994'
		},
		{
			title: 'The Shawshank Redemption',
			description: 'Two imprisoned men bond over several years.',
			releaseYear: '1994'
		}
		// Add more DVD objects as needed
	];

	let scrollContainer;
	let scrollAmount = 0;
	let maxScroll;
	let containerWidth;
	let showButtons = false;

	onMount(() => {
		updateScrollMetrics();
		window.addEventListener('resize', updateScrollMetrics);
		return () => window.removeEventListener('resize', updateScrollMetrics);
	});

	function updateScrollMetrics() {
		maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		containerWidth = scrollContainer.clientWidth;
	}

	function scrollLeft() {
		scrollAmount = Math.max(scrollAmount - containerWidth, 0);
		scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
	}

	function scrollRight() {
		scrollAmount = Math.min(scrollAmount + containerWidth, maxScroll);
		scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
	}

	function handleMouseEnter() {
		showButtons = true;
	}

	function handleMouseLeave() {
		showButtons = false;
	}

	$: canScrollLeft = scrollAmount > 0;
	$: canScrollRight = scrollAmount < maxScroll;
</script>

<div
	class="dvd-container"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
>
	<div class="scroll-button-container left" class:active={canScrollLeft}>
		<IconButton on:click={scrollLeft} disabled={!canScrollLeft} class="scroll-button">
			<i class="material-icons">chevron_left</i>
		</IconButton>
	</div>

	<div class="scroll-button-container right" class:active={canScrollRight}>
		<IconButton on:click={scrollRight} disabled={!canScrollRight} class="scroll-button">
			<i class="material-icons">chevron_right</i>
		</IconButton>
	</div>

	<div class="scroll-container" bind:this={scrollContainer}>
		{#await dvds}
			Loading films...
		{:then dvds}
			{#each dvds as film}
				<div class="dvd-item">
					<DVDTitle
						dvdId={film.film_id}
						title={film.title}
						description={film.description}
						imageUrl={film.poster_path}
						releaseYear={film.release_year}
					/>
				</div>
			{/each}
		{:catch error}
			<p>error loading films: {error.message}</p>
		{/await}
	</div>
</div>

<style>
	.dvd-container {
		position: relative;
		width: 100%;
		padding: 20px 0;
	}

	.scroll-container {
		display: flex;
		overflow-x: hidden;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		padding: 10px 0;
	}

	.dvd-item {
		flex: 0 0 auto;
		margin-right: 20px;
	}

	.scroll-button-container {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.scroll-button-container.active {
		z-index: 1000;
		opacity: 1;
		pointer-events: all;
	}

	.scroll-button-container.left {
		left: 0;
	}

	.scroll-button-container.right {
		z-index: 1000;
		right: 0;
		background: linear-gradient(270deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%);
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.scroll-container::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scroll-container {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
