<script lang="ts">
	import TextInput from 'components/general/TextInput.svelte';
	import TextField from 'components/general/TextField.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Group } from '$lib/types/group';

	const dispatch = createEventDispatcher<{ submit: Group; close: void }>();

	export let group: Group = {
		_id: '',
		name: '',
		description: '',
		items: []
	};

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		if (!group.name) {
			nameInputIsMissing = true;
		}
		if (!group.description) {
			descriptionInputIsMissing = true;
		}
		if (nameInputIsMissing || descriptionInputIsMissing) {
			return;
		}

		dispatch('submit', {
			_id: group._id || '',
			name: group.name,
			description: group.description,
			items: []
		});
	}

	let nameInputIsMissing = false;
	let descriptionInputIsMissing = false;
</script>

<div class="p-4">
	<slot name="title" />
	<form id="groupForm" class="mt-4" on:submit|preventDefault={onSubmit}>
		<TextInput
			isRequired={true}
			inputLabel={'Name'}
			inputPlaceholder="Name"
			bind:textValue={group.name}
			class={`${nameInputIsMissing ? 'input-error' : 'input-primary'}`}
			on:onUserInteraction={() => {
				nameInputIsMissing = false;
			}}
		/>
		<TextField
			isRequired={true}
			inputLabel={'Description'}
			inputPlaceholder="Write the description here"
			bind:textValue={group.description}
			on:onUserInteraction={() => {
				descriptionInputIsMissing = false;
			}}
			class={`${nameInputIsMissing ? 'textarea-error' : 'textarea-primary'}`}
		/>

		<div class="mt-4 flex justify-between">
			<button
				class="btn btn-outline btn-error"
				type="button"
				on:click={() => {
					close();
				}}>Close</button
			>
			<button type="submit" class="btn btn-outline btn-info">Save</button>
		</div>
	</form>
</div>
