<script lang="ts">
	import TextInput from 'components/general/TextInput.svelte';
	import TextField from 'components/general/TextField.svelte';

	import { createEventDispatcher } from 'svelte';

	import * as Icons from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import SelectDropdown from 'components/general/SelectDropdown.svelte';
	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import Icon from 'components/general/Icon.svelte';

	const dispatch = createEventDispatcher<{ submit: Role; close: void }>();

	export let role: Role = {
		_id: '',
		name: '',
		description: '',
		icon: ''
	};

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		dispatch('submit', {
			_id: role._id || '',
			name: role.name,
			description: role.description,
			icon: selectedIcon
		});
	}

	export let title = '';

	let selectableIcons: Array<SvelteSelectableItem> = [];

	for (const key of Object.entries(Icons)) {
		const anyKey = key as any; // TODO fix this type somehow 
		selectableIcons.push({
			value: anyKey[0],
			label: anyKey[1].iconName
		});
	}
 
	let selectedIcon = role.icon || '';
	const handleSelect = (event: CustomEvent<SvelteSelectableItem>) => {
		selectedIcon = event.detail.value;
	};
</script>

<h1>{title}</h1>
<TextInput
	inputLabel={'Name'}
	inputPlaceholder="Name"
	bind:textValue={role.name}
	class="input-accent"
/>
<TextField
	inputLabel={'Description'}
	inputPlaceholder="Write the description here"
	bind:textValue={role.description}
/>

<div class="themed-select item">
	Icon (https://fontawesome.com/search?o=r&m=free)
	<Icon size="lg" icon={selectedIcon} testId="RoleFormIcon" />

	<SelectDropdown
		items={selectableIcons}
		placeholder={'Select..'}
		value={selectedIcon}
		on:dropdownSelect={handleSelect}
	/>
</div>

<div>
	<button
		class="btn btn-outline btn-error"
		type="button"
		on:click={() => {
			close();
		}}>Close</button
	>
	<button type="button" class="btn btn-outline btn-info" on:click={onSubmit}>Save</button>
</div>

<style>
</style>
