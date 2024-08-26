<script>
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';
	import Button, { Label } from '@smui/button';

	export let title = 'DVD Title';
	export let description = 'DVD Description';
	export let imageUrl = 'https://via.placeholder.com/300x200';
	export let releaseYear = '2023';
</script>

<Card style="height: 220px; width: 130px">
	<PrimaryAction class="dvd-card" on:click={() => alert(`You clicked on ${title}`)}>
		<Media style="background-image: url({imageUrl}); height:100%" aspectRatio="16x9">
			<!-- <MediaContent>
				<div style="color: white; position: absolute; bottom: 16px; left: 16px;">
					<h2 class="mdc-typography--headline6" style="margin: 0;">{title}</h2>
					<h3 class="mdc-typography--subtitle2" style="margin: 0;">{releaseYear}</h3>
				</div>
			</MediaContent> -->
		</Media>
	</PrimaryAction>
</Card>

<style>
	/* You can add any additional styles here */
	:global(.dvd-card) {
		height: 100%;
	}
</style>
