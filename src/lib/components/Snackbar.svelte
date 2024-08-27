<script>
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import { snackbarStore } from '$lib/utils/snackbarStore.js';
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';

	let snackbar;
	let message = '';
	let type = 'info';
	let duration = 5000;

	onMount(() => {
		const unsubscribe = snackbarStore.subscribe(($snackbarStore) => {
			if ($snackbarStore.show) {
				console.log('$snackbarStore', $snackbarStore);
				message = $snackbarStore.message;
				type = $snackbarStore.type;
				duration = $snackbarStore.duration;
				snackbar.open();
			}
		});

		return unsubscribe;
	});

	function handleClose() {
		snackbarStore.close();
	}
</script>

<Snackbar bind:this={snackbar} class="snackbar {type}" on:close={handleClose}>
	<Label>{message}</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<style>
	:global(.snackbar) {
		z-index: 1000;
	}
	:global(.snackbar.info) {
		background-color: #2196f3;
	}
	:global(.snackbar.success > .mdc-snackbar__surface) {
		background-color: #4caf50;
	}
	:global(.snackbar.warning) {
		background-color: #ffc107;
	}
	:global(.snackbar.error) {
		background-color: #f44336;
	}
</style>
