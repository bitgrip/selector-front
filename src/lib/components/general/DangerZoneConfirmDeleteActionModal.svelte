<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import DangerZoneConfirmDeleteActionFields from './DangerZoneConfirmDeleteActionFields.svelte';

	const dispatch = createEventDispatcher<{ cancel: void; ok: void }>();
	$: classesFromTheParent = $$props.class;

	export let subject: string;
	export let expectedConfirmationText: string | undefined;

	let confirmationTextValue: string;
	$: confirmationButtonIsDisabled = expectedConfirmationText
		? expectedConfirmationText === undefined || expectedConfirmationText !== confirmationTextValue
		: false;

	function cancel() {
		dispatch('cancel');
	}

	function ok() {
		dispatch('ok');
	}
</script>

<Modal class={classesFromTheParent} on:clickOutside={() => cancel()}>
	<slot name="title" slot="modal-title" />

	<svelte:fragment slot="modal-content">
		<slot name="confirmation-content" />
		<DangerZoneConfirmDeleteActionFields bind:confirmationTextValue {expectedConfirmationText} />
	</svelte:fragment>

	<svelte:fragment slot="modal-buttons">
		<div class="mt-4 flex justify-between w-full flex-wrap gap-3">
			<button
				class="mb-3 btn btn-outline btn-info w-full lg:w-auto lg:mb-0 grow"
				type="button"
				on:click={() => {
					cancel();
				}}>Close</button
			>
			<button
				type="button"
				disabled={confirmationButtonIsDisabled}
				class="btn btn-outline btn-error w-full lg:w-auto grow"
				on:click={() => {
					ok();
				}}
			>
				I understand the consequences, delete this {subject}
			</button>
		</div>
	</svelte:fragment>
</Modal>
