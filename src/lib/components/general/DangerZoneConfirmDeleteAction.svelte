<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher<{ cancel: void; ok: void }>();

	export let subject: string;
	export let expectedConfirmationText: string;

	let confirmationTextValue: string;
	$: confirmationButtonIsDisabled =
		expectedConfirmationText === undefined || expectedConfirmationText !== confirmationTextValue;

	function cancel() {
		dispatch('cancel');
	}

	function ok() {
		dispatch('ok');
	}

	let confirmationInputField: HTMLInputElement;
	onMount(() => {
		confirmationInputField.focus();
	});
</script>

<div>
	<div>
		<h1><slot name="title" /></h1>
		<slot name="content" />
	</div>
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
			class="input input-bordered w-full max-w-xs input-accent"
		/>
	</div>
	<div class="flex mt-8 gap-2">
		<button
			class="btn btn-outline btn-secondary"
			type="button"
			on:click={() => {
				cancel();
			}}
		>
			Cancel
		</button>
		<button
			disabled={confirmationButtonIsDisabled}
			type="button"
			class="btn btn-outline btn-error"
			on:click={ok}
		>
			I understand the consequences, delete this {subject}
		</button>
	</div>
</div>
