<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ save: void; close: void }>();

	export let saveButtonDisabled = false;

	function close() {
		dispatch('close');
	}

	function save() {
		dispatch('save');
	}
</script>

<div class="mt-4 flex justify-between w-full">
	<button
		class="btn btn-outline btn-error"
		type="button"
		aria-label="Close"
		on:click={() => {
			close();
		}}>Close</button
	>
	<button
		type="button"
		class="btn btn-outline btn-info"
		disabled={saveButtonDisabled}
		aria-label="Save"
		on:click={() => {
			save();
		}}>Save</button
	>
</div>
