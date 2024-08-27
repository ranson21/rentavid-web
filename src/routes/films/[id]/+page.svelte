<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import List, { Item, Graphic } from '@smui/list';

	import { capitalize } from '$lib/utils/format';
	import DvdTitle from '$lib/components/DVDTitle.svelte';
	import RentButton from '$lib/components/RentButton.svelte';
	import { invalidate } from '$app/navigation';

	onMount(() => {
		const unsubscribe = invalidate((url) => url.pathname.startsWith('/films/'));
		return unsubscribe;
	});

	// Dummy data - replace with actual data fetching logic
	export let data;
</script>

<div
	class="backdrop"
	style="background-image: url({data.film.backdrop_path}); height: 400px;"
></div>
<div class="content">
	<div class="left">
		<img src={data.film.poster_path} alt={data.film.title} class="dvd-cover" />
	</div>
	<div class="middle">
		<h3>{capitalize(data.film.title)} ({data.film.release_year})</h3>
		<span class="hr" />
		<p>{data.film.description}</p>
		<p><b>Rental Rate:</b> ${data.film.rental_rate}</p>
		<p><b>Rental Duration:</b> {data.film.rental_duration} days</p>
		<RentButton dvdId={data.film.film_id} title={data.film.title} />
	</div>
	<div class="right">
		<h3>Cast</h3>
		<span class="hr" style="margin-bottom: 16px;" />
		<List>
			{#each $page.data.actors as actor}
				<Item nonInteractive>
					<img
						src="https://placehold.co/25x25?text={[actor.first_name, actor.last_name]
							.map((val) => val.substring(0, 1))
							.join('')}"
						alt="Avatar"
						class="avatar"
					/>
					<h6>{capitalize(actor.first_name)} {capitalize(actor.last_name)}</h6>
				</Item>
			{/each}
		</List>
	</div>
</div>

<div class="related-dvds">
	<h3>Related DVDs</h3>
	<span class="hr" style="margin-bottom: 16px;" />
	<div class="related-list">
		{#each $page.data.related as related}
			<div class="dvd-item">
				<DvdTitle dvdId={related.film_id} imageUrl={related.poster_path} title={related.title} />
			</div>
		{/each}
	</div>
</div>

<style>
	h5 {
		margin: 0;
	}

	h6 {
		font-weight: 300;
	}

	h3 {
		margin: 0;
	}

	.hr {
		background: rgba(0, 0, 0, 0.6);
		height: 1px;
		display: block;
		border-bottom: 1px solid rgba(255, 255, 255, 0.6);
	}

	.avatar {
		vertical-align: middle;
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.backdrop {
		background-size: cover;
		background-position: center;
	}

	.content {
		display: flex;
		padding: 20px;
		margin: 0 500px;
	}

	.left,
	.middle,
	.right {
		padding: 10px;
	}

	.left {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.middle {
		flex: 2;
		border-right: 1px solid #ccc;
		padding-right: 20px;
	}

	.right {
		flex: 1;
		padding-left: 20px;
		min-width: 300px;
		max-height: 400px;
		overflow-y: scroll;
	}

	.dvd-cover {
		height: 300px;
	}

	.related-dvds {
		padding: 20px;
		padding: 20px;
		margin: 0 500px;
	}

	.related-list {
		display: flex;
		overflow-x: auto;
	}

	.dvd-item {
		flex: 0 0 auto;
		margin-right: 20px;
	}

	:global(.mdc-deprecated-list-item) {
		gap: 10px;
	}
</style>
