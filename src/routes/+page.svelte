<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { page } from '$app/stores';
	import DvdContainer from '$lib/DVDContainer.svelte';

	import Hero from '$lib/Hero.svelte';
</script>

<Hero carouselItems={$page.data.featuredFilms} />

{#each $page.data.categories as category}
	<div class="mdc-typography--headline5" style="margin-left: 10px">{category.name}</div>
	<span class="hr" />
	{#await data.films[category.category_id]}
		<DvdContainer />
	{:then dvds}
		<DvdContainer {dvds} />
	{:catch error}
		<p>error loading films: {error.message}</p>
	{/await}
{/each}

<style>
	.hr {
		background: rgba(0, 0, 0, 0.6);
		height: 1px;
		margin-left: 10px;
		margin-right: 10px;
		display: block;
		border-bottom: 1px solid rgba(255, 255, 255, 0.6);
	}
</style>
