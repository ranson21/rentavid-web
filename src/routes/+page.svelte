<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Welcome to SvelteKit</h1>

{#await data.films}
	Loading films...
{:then films}
	{#each films as film}
		<p>{film.title}</p>
	{/each}
{:catch error}
	<p>error loading comments: {error.message}</p>
{/await}
