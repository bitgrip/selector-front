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

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		dispatch('submit', {
			...formItem
		});
	}

	export let item: Item = {
		_id: '',
		name: '',
		description: '',
		roles: [],
		isLongerThenOneDay: false,
		groupes: []
	};

	export let title = '';
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

	const handleSelect = (event: CustomEvent<SvelteSelectableItem>) => {
		selectedRolesIds = addItemToArrayIfNotAlreadyThere(selectedRolesIds, event.detail.value);
	};

	const deleteTrigger = (roleId: Role['_id']) => {
		selectedRolesIds = removeItemFromArray(selectedRolesIds, roleId);
	};

	function onRadioChange(event: any) {
		// TODO what is the correct event type?!
		selectedRadioGroup = event?.currentTarget?.value;
	}
</script>

<h1>{title}</h1>
<div class="flex w-full">
	<div class="bg-base-300 rounded-box w-80 p-4">
		<TextInput
			inputLabel={'Name'}
			class="input-info"
			inputPlaceholder="Name of the item"
			bind:textValue={formItem.name}
		/>

		<TextField
			inputLabel={'Description'}
			inputPlaceholder="Write the description here"
			bind:textValue={formItem.description}
		/>

		<label class="cursor-pointer label">
			<span class="label-text">Interval tracking?</span>
			<input
				type="checkbox"
				class="toggle toggle-primary"
				bind:checked={formItem.isLongerThenOneDay}
			/>
		</label>
	</div>
	<div class="divider divider-horizontal" />

	<div class="bg-base-300 rounded-box w-80 p-4">
		<div>
			<div class="item">
				Roles
				<SelectDropdown
					items={rolesForSelect}
					placeholder={'Select..'}
					value={undefined}
					on:dropdownSelect={(event) => handleSelect(event)}
				/>
			</div>

			Selected roles:
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
		</div>

		Choose Group:
		<div class="flex flex-col">
			{#each groupesForSelect || [] as group}
				<label>
					<input
						on:change={onRadioChange}
						type="radio"
						bind:group={selectedRadioGroup}
						name="groupes"
						class="radio radio-accent"
						value={group.value}
					/>
					{group.label}
				</label>
			{/each}
		</div>
	</div>
</div>

<div class="buttons">
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
	.buttons {
		margin-top: 3em;
		display: flex;
		justify-content: space-between;
	}
</style>
