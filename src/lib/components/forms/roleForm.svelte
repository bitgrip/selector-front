<script lang="ts">
	import TextInput from 'components/general/TextInput.svelte';
	import TextField from 'components/general/TextField.svelte';

	import { createEventDispatcher } from 'svelte';

	import * as Icons from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import SelectDropdown from 'components/general/SelectDropdown.svelte';
	import Link from 'components/general/Link.svelte';

	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import Icon from 'components/general/Icon.svelte';

	const dispatch = createEventDispatcher<{ submit: Role; close: void }>();

	export let role: Role = {
		_id: '',
		name: '',
		description: '',
		canHaveMultipleParticipants: false,
		icon: ''
	};

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		if (!role.name) {
			nameInputIsMissing = true;
		}
		if (!role.description) {
			descriptionInputIsMissing = true;
		}
		if (nameInputIsMissing || descriptionInputIsMissing) return;
		dispatch('submit', {
			_id: role._id || '',
			name: role.name,
			description: role.description,
			canHaveMultipleParticipants: role.canHaveMultipleParticipants || false,
			icon: selectedIcon
		});
	}

	let nameInputIsMissing = false;
	let descriptionInputIsMissing = false;

	let selectableIcons: Array<SvelteSelectableItem> = [];

	for (const key of Object.entries(Icons)) {
		const anyKey = key as any; // TODO fix this type somehow
		selectableIcons.push({
			value: anyKey[0],
			label: anyKey[1].iconName
		});
	}

	let selectedIcon = role.icon || 'faQuestion';
	const handleSelect = (event: CustomEvent<{ [key: number]: SvelteSelectableItem }>) => {
		selectedIcon = event.detail[0].value;
	};
</script>

<div class="p-4">
	<slot name="title" />

	<TextInput
		isRequired={true}
		inputLabel={'Name'}
		inputPlaceholder="role name"
		bind:textValue={role.name}
		class={`${nameInputIsMissing ? 'input-error' : 'input-primary'}`}
		on:onUserInteraction={() => {
			nameInputIsMissing = false;
		}}
	/>
	<TextField
		isRequired={true}
		inputLabel={'Description'}
		inputPlaceholder="role description"
		bind:textValue={role.description}
		class={`${descriptionInputIsMissing ? 'textarea-error' : 'textarea-primary'}`}
		on:onUserInteraction={() => {
			descriptionInputIsMissing = false;
		}}
	/>

	<div class="themed-select item">
		Icon <Link text="(selection)" href="https://fontawesome.com/search?o=r&m=free" />

		<div class="flex flex-row w-full justify-between items-center	">
			<SelectDropdown
				items={selectableIcons}
				placeholder={'Select..'}
				value={selectedIcon}
				on:dropdownSelect={handleSelect}
				class={'w-4/5'}
			/>
			<div class="grow flex justify-center items-center ">
				<Icon size="lg" icon={selectedIcon} testId="RoleFormIcon" />
			</div>
		</div>
	</div>

	<label class="cursor-pointer label w-2/3 mt-4">
		<input
			type="checkbox"
			class="toggle toggle-primary"
			bind:checked={role.canHaveMultipleParticipants}
		/>
		<span class="label-text">Can have multiple participants?</span>
	</label>

	<div class="mt-4 flex justify-between">
		<button
			class="btn btn-outline btn-error"
			type="button"
			on:click={() => {
				close();
			}}>Close</button
		>
		<button type="button" class="btn btn-outline btn-info" on:click={onSubmit}>Save</button>
	</div>
</div>
