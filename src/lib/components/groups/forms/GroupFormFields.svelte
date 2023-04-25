<script lang="ts">
	import type { Group } from '$lib/types/group';
	import TextField from 'components/forms/TextField.svelte';
	import TextInput from 'components/forms/TextInput.svelte';

	export let formValidation = {
		nameInputIsMissing: false,
		descriptionInputIsMissing: false
	};

	export let group: Group = {
		_id: '',
		name: '',
		description: '',
		items: []
	};

	export let formGroup: Group = {
		_id: group?._id || '',
		name: group?.name || '',
		description: group?.description || '',
		items: group?.items || []
	};
</script>

<div class="p-4">
	<form id="groupForm" class="mt-4">
		<TextInput
			isRequired={true}
			inputLabel={'Name'}
			inputPlaceholder="Name"
			bind:textValue={formGroup.name}
			class={`${formValidation.nameInputIsMissing ? 'input-error' : 'input-primary'}`}
			on:onUserInteraction={() => {
				formValidation.nameInputIsMissing = false;
			}}
		/>
		<TextField
			isRequired={true}
			inputLabel={'Description'}
			inputPlaceholder="Write the description here"
			bind:textValue={formGroup.description}
			on:onUserInteraction={() => {
				formValidation.descriptionInputIsMissing = false;
			}}
			class={`${formValidation.nameInputIsMissing ? 'textarea-error' : 'textarea-primary'}`}
		/>
	</form>
</div>
