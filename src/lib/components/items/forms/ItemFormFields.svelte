<script lang="ts">
	import type { Group } from '$lib/types/group';
	import type { Item, ItemRequestType } from '$lib/types/item';
	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import NumberInput from 'components/forms/NumberInput.svelte';
	import SelectDropdown from 'components/forms/SelectDropdown.svelte';
	import TextField from 'components/forms/TextField.svelte';
	import TextInput from 'components/forms/TextInput.svelte';
	import ToggleInput from 'components/forms/ToggleInput.svelte';
	import RoleBadge from 'components/roles/RoleBadge.svelte';
	import {
		addItemToArrayIfNotAlreadyThere,
		findByKeyInArray,
		removeItemFromArray
	} from 'utils/arrayUtils';

	export let formValidation = {
		nameInputIsMissing: false
	};

	export let item: Item = {
		_id: '',
		name: '',
		description: '',
		longDescription: '',
		roles: [],
		isLongerThenOneDay: false,
		usualLenght: null,
		groupes: []
	};

	export let allGroupes: Array<Group> = [];
	export let allRoles: Array<Role> = [];
	let selectedRolesIds: Array<string> = [];

	// item can only be in one group, it is still an array because of legacy i guess
	let selectedRadioGroup = item.groupes[0]?._id || '';

	let rolesForSelect: Array<{
		value: Role['_id'];
		label: Role['name'];
	}> = [];

	let groupesForSelect: Array<{
		value: Group['_id'];
		label: Group['name'];
	}> = [];

	export let formItem: ItemRequestType = {
		_id: item._id,
		isLongerThenOneDay: item.isLongerThenOneDay || false,
		description: item.description || '',
		longDescription: item.longDescription || '',
		usualLenght: item.usualLenght || null,
		name: item.name || '',
		groupes: [],
		roles: []
	};

	console.log(formItem);

	if (allRoles.length > 0) {
		rolesForSelect = allRoles.map((role) => {
			return {
				value: role._id,
				label: role.name
			};
		});
	}

	if (allGroupes.length > 0) {
		groupesForSelect = allGroupes.map((group) => {
			return {
				value: group._id,
				label: group.name
			};
		});
	}

	item.roles.forEach((role) => {
		selectedRolesIds.push(role._id);
	});

	$: if (selectedRadioGroup) formItem.groupes = [selectedRadioGroup];
	$: formItem.roles = selectedRolesIds;

	const handleSelect = (event: CustomEvent<{ [key: number]: SvelteSelectableItem }>) => {
		selectedRolesIds = addItemToArrayIfNotAlreadyThere(selectedRolesIds, event.detail[0].value);
	};

	const deleteTrigger = (roleId: Role['_id']) => {
		selectedRolesIds = removeItemFromArray(selectedRolesIds, roleId);
	};

	function onRadioChange(event: any) {
		// TODO what is the correct event type?!
		selectedRadioGroup = event?.currentTarget?.value;
	}
</script>

<form id="itemForm" class="mt-4 ">
	<div class="flex flex-col w-full lg:flex-row mt-2">
		<div class="lg:w-80 w-full p-4 grid flex-grow  card bg-base-300 rounded-box">
			<TextInput
				isRequired={true}
				inputLabel={'Name'}
				class={`${formValidation.nameInputIsMissing ? 'input-error' : 'input-primary'}  w-full`}
				inputPlaceholder="name of the item"
				bind:textValue={formItem.name}
				on:onUserInteraction={() => {
					formValidation.nameInputIsMissing = false;
				}}
			/>

			<TextField
				inputLabel={'Long description'}
				inputLabelHelp={'supports Markdown, shown on the Detail page'}
				class=" w-full textarea-primary leading-tight h-44"
				inputPlaceholder="long description"
				bind:textValue={formItem.longDescription}
			/>
		</div>
		<div class="divider lg:divider-horizontal" />

		<div class="lg:w-80 w-full p-4 grid flex-grow card bg-base-300 rounded-box">
			<div>
				<TextField
					inputLabel={'Short description'}
					inputLabelHelp={'shown on the overview page'}
					class="textarea-primary leading-tight"
					inputPlaceholder="short description"
					bind:textValue={formItem.description}
				/>

				<div class="item">
					<span class="label-text">Roles</span>
					<SelectDropdown
						items={rolesForSelect}
						placeholder={'Select..'}
						value={undefined}
						on:dropdownSelect={(event) => handleSelect(event)}
					/>
				</div>

				<span class="label-text">Selected roles:</span>
				<div>
					{#each selectedRolesIds || [] as roleId}
						<RoleBadge
							role={findByKeyInArray('_id', roleId, allRoles)}
							deleteButton={true}
							on:delete={() => {
								deleteTrigger(roleId);
							}}
						/>
					{/each}
				</div>

				<ToggleInput
					inputLabel={'Interval tracking?'}
					class="toggle-primary"
					bind:value={formItem.isLongerThenOneDay}
					inputLabelHelp={'Turn on if the tracked item duration is longer then one day. '}
				/>

				<NumberInput
					minimalValue={2}
					isRequired={false}
					inputIsDisabled={!formItem.isLongerThenOneDay}
					inputLabel={'Predefined length in days'}
					class={`input-primary w-full`}
					inputPlaceholder="Predefined item duration"
					inputLabelHelp={"Leave empty if don't want to define any. This will help \
					you when creating new events with interval tracking as you will only have to select the starting date."}
					bind:numberValue={formItem.usualLenght}
				/>
			</div>
		</div>

		<div class="divider lg:divider-horizontal" />

		<div class="lg:w-40 w-full p-4  grid flex-grow  card bg-base-300 rounded-box">
			<span class="label-text">Group</span>

			<div class="flex flex-col">
				{#each groupesForSelect || [] as group}
					<label class="label cursor-pointer">
						<span class="label-text">{group.label}</span>
						<input
							on:change={onRadioChange}
							type="radio"
							bind:group={selectedRadioGroup}
							name="groupes"
							class="radio radio-primary"
							value={group.value}
						/>
					</label>
				{/each}
			</div>
		</div>
	</div>
</form>
