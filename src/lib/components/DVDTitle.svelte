<script>
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';

	import { capitalize } from '$lib/utils/format';
	import { routeToPage } from '$lib/utils/common';

	export let width = 120;
	export let dvdId;
	export let hideTitle = false;
	export let title = 'DVD Title';
	export let description = 'DVD Description';
	export let imageUrl;
	export let releaseYear = '2023';
</script>

<Card style="height: 220px; width: {width}px">
	<PrimaryAction class="dvd-card" on:click={() => routeToPage(`films/${dvdId}`)}>
		<Media style="background-image: url({imageUrl}); height:100%" aspectRatio="16x9"></Media>
	</PrimaryAction>
</Card>
{#if !hideTitle}
	<div class="mdc-typography--outline dvd-title">{capitalize(title)}</div>
{/if}

<style>
	/* You can add any additional styles here */
	:global(.dvd-card) {
		height: 100%;
	}

	.dvd-title {
		margin-top: 5px;
		max-width: 130px;
		text-overflow: ellipsis;
		text-wrap: nowrap;
		overflow: hidden;
	}
</style>
