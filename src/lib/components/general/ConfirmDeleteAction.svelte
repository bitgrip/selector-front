<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ cancel: void; ok: void }>();

	function cancel() {
		dispatch('cancel');
	}

	function ok() {
		dispatch('ok');
	}
</script>

<div>
	<div>
		<h1><slot name="title" /></h1>
		<slot name="content" />
	</div>
	<div class="buttons">
		<button
			class="btn btn-outline btn-secondary"
			type="button"
			on:click={() => {
				cancel();
			}}
		>
			Cancel
		</button>
		<button type="button" class="btn btn-outline btn-error" on:click={ok}>Ok</button>
	</div>
</div>

<style>
	.buttons {
		margin-top: 3em;
		display: flex;
		justify-content: space-between;
	}
</style>
