<script>
	export let size = 40; // Default size of the logo
	export let color = '#ffffff'; // Default color (white)

	import { Title } from '@smui/top-app-bar';
</script>

<div class="logo">
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="50" cy="50" r="45" stroke={color} stroke-width="10" />
		<path d="M30 50 L50 30 L70 50 L50 70 Z" fill={color} />
	</svg>
	<Title tag="a" href="/">Rent-A-Vid</Title>
</div>

<style>
	.logo {
		display: flex;
		align-items: center;
		font-family: Arial, sans-serif;
	}
</style>
