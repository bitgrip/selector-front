<script lang="ts">
	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import * as Icons from '@fortawesome/free-solid-svg-icons';
	import SelectDropdown from 'components/forms/SelectDropdown.svelte';
	import TextField from 'components/forms/TextField.svelte';
	import TextInput from 'components/forms/TextInput.svelte';
	import Icon from 'components/general/Icon.svelte';
	import Link from 'components/general/Link.svelte';

	export let formValidation = {
		nameInputIsMissing: false,
		descriptionInputIsMissing: false
	};

	export let role: Role = {
		_id: '',
		name: '',
		description: '',
		canHaveMultipleParticipants: false,
		icon: ''
	};

	export let formRole: Role = {
		_id: role?._id || '',
		name: role?.name || '',
		description: role?.description || '',
		canHaveMultipleParticipants: role?.canHaveMultipleParticipants || false,
		icon: role?.description || ''
	};

	let selectableIcons: Array<SvelteSelectableItem> = [];

	for (const key of Object.entries(Icons)) {
		const anyKey = key as any; // TODO fix this type somehow
		if (anyKey[0] && anyKey[1]?.icon) {
			selectableIcons.push({
				value: anyKey[0],
				label: anyKey[1].iconName
			});
		}
	}

	let selectedIcon = role.icon || 'faQuestion';
	$: formRole.icon = selectedIcon;

	const handleSelect = (event: CustomEvent<{ [key: number]: SvelteSelectableItem }>) => {
		selectedIcon = event.detail[0].value;
	};
</script>

<div class="p-4">
	<form id="roleForm" class="mt-4">
		<TextInput
			isRequired={true}
			inputLabel={'Name'}
			inputPlaceholder="role name"
			bind:textValue={formRole.name}
			class={`${formValidation.nameInputIsMissing ? 'input-error' : 'input-primary'}`}
			on:onUserInteraction={() => {
				formValidation.nameInputIsMissing = false;
			}}
		/>
		<TextField
			isRequired={true}
			inputLabel={'Description'}
			inputPlaceholder="role description"
			bind:textValue={formRole.description}
			class={`${formValidation.descriptionInputIsMissing ? 'textarea-error' : 'textarea-primary'}`}
			on:onUserInteraction={() => {
				formValidation.descriptionInputIsMissing = false;
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
				bind:checked={formRole.canHaveMultipleParticipants}
			/>
			<span class="label-text">Can have multiple participants?</span>
		</label>
	</form>
</div>
