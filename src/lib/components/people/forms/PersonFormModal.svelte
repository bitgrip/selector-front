<script lang="ts">
	import type { Group } from '$lib/types/group';
	import type { Person } from '$lib/types/person';
	import ActionButtons from 'components/forms/ActionButtons.svelte';
	import Modal from 'components/general/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import PersonFormFields from './PersonFormFields.svelte';

	const dispatch = createEventDispatcher<{ submit: Person; close: void }>();
	$: classesFromTheParent = $$props.class;

	let formValidation = {
		nameInputIsMissing: false
	};

	let saveButtonDisabled = false;

	export let person: Person = {
		_id: '',
		name: '',
		itemsCanBeAttended: [],
		groupes: [],
		active: true
	};

	let formPersonSubmitted: Person = {
		_id: person?._id || '',
		name: person?.name || '',
		itemsCanBeAttended: person?.itemsCanBeAttended || [],
		groupes: person?.groupes || [],
		active: person?.active || false
	};

	function close() {
		dispatch('close');
	}

	function submit() {
		if (!formPersonSubmitted.name) {
			formValidation.nameInputIsMissing = true;
			saveButtonDisabled = false;
			return;
		}

		saveButtonDisabled = true;
		dispatch('submit', {
			...formPersonSubmitted
		});
	}

	export let allGroupes: Array<Group> = [];
</script>

<Modal class={classesFromTheParent}>
	<slot name="title" slot="modal-title" />

	<svelte:fragment slot="modal-content">
		<PersonFormFields
			bind:formPerson={formPersonSubmitted}
			{allGroupes}
			{formValidation}
			{person}
		/>
	</svelte:fragment>

	<svelte:fragment slot="modal-buttons">
		<ActionButtons on:save={() => submit()} on:close={() => close()} {saveButtonDisabled} />
	</svelte:fragment>
</Modal>
