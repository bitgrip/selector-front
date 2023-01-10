<script lang="ts">
	import TextInput from 'components/general/TextInput.svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		addItemToArrayIfNotAlreadyThere,
		findByKeyInArray,
		removeItemFromArray
	} from 'utils/arrayUtils';
	import SelectDropdown from 'components/general/SelectDropdown.svelte';
	import TextField from 'components/general/TextField.svelte';
	import RoleBadge from 'components/roles/RoleBadge.svelte';
	import type { Item, ItemRequestType } from '$lib/types/item';
	import type { Group } from '$lib/types/group';
	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';

	const dispatch = createEventDispatcher<{ submit: ItemRequestType; close: void }>();

	let nameInputIsMissing = false;

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		if (!formItem.name) {
			nameInputIsMissing = true;
			return;
		}

		dispatch('submit', {
			...formItem
		});
	}

	export let item: Item = {
		_id: '',
		name: '',
		description: '',
		longDescription: '',
		roles: [],
		isLongerThenOneDay: false,
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

	const formItem: ItemRequestType = {
		_id: item._id,
		isLongerThenOneDay: item.isLongerThenOneDay || false,
		description: item.description || '',
		longDescription: item.longDescription || '',
		name: item.name || '',
		groupes: [],
		roles: []
	};

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

<div class="p-4">
	<slot name="title" />

	<form id="itemForm" class="mt-4">
		<div class="flex flex-col w-full lg:flex-row mt-2">
			<div class="w-80 p-4 grid flex-grow  card bg-base-300 rounded-box">
				<TextInput
					isRequired={true}
					inputLabel={'Name'}
					class={`${nameInputIsMissing ? 'input-error' : 'input-primary'}`}
					inputPlaceholder="name of the item"
					bind:textValue={formItem.name}
					on:onUserInteraction={() => {
						nameInputIsMissing = false;
					}}
				/>

				<TextField
					inputLabel={'Long description'}
					inputLabelHelp={'supports Markdown, shown on the Detail page'}
					class="textarea-primary leading-tight h-44"
					inputPlaceholder="long description"
					bind:textValue={formItem.longDescription}
				/>
			</div>
			<div class="divider lg:divider-horizontal" />

			<div class="w-80 p-4  grid flex-grow  card bg-base-300 rounded-box">
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

					<label class="cursor-pointer label">
						<span class="label-text">Interval tracking?</span>
						<input
							type="checkbox"
							class="toggle toggle-primary"
							bind:checked={formItem.isLongerThenOneDay}
						/>
					</label>
				</div>
			</div>

			<div class="divider lg:divider-horizontal" />

			<div class="w-40 p-4  grid flex-grow  card bg-base-300 rounded-box">
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
	</form>
</div>
