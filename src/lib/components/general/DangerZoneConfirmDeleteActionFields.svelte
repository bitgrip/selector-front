<script lang="ts">
	import { onMount } from 'svelte';

	export let expectedConfirmationText: string | undefined;
	export let confirmationTextValue: string;

	let confirmationInputField: HTMLInputElement;
	onMount(() => {
		if (expectedConfirmationText) {
			confirmationInputField.focus();
		}
	});
</script>

<div>
	{#if expectedConfirmationText}
		<div class="flex flex-col gap-2">
			<label for="confirmationText"
				>Please type <span class="font-bold">{expectedConfirmationText}</span> to confirm.</label
			>
			<input
				id="confirmationText"
				name="confirmationText"
				bind:this={confirmationInputField}
				bind:value={confirmationTextValue}
				type="text"
				class="input input-bordered w-full lg:w-auto input-primary"
			/>
		</div>
	{/if}
</div>
