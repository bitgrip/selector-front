<script lang="ts">
	import TextInput from 'components/general/TextInput.svelte';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	import {
		addItemToArrayIfNotAlreadyThere,
		findByKeyInArray,
		findIndexByKeyInArray,
		removeItemFromArray
	} from 'utils/arrayUtils';
	import GroupToggle, { type mappedDataType } from 'components/general/GroupToggle.svelte';
	import type { Item } from '$lib/types/item';
	import type { Group } from '$lib/types/group';
	import type { Person } from '$lib/types/person';

	const dispatch = createEventDispatcher<{ submit: Person; close: void }>();

	let itemCheckStates = [];
	export let allItems: Array<Item> = [];

	export let title = '';

	export let person: Person = {
		_id: '',
		name: '',
		itemsCanBeAttended: [],
		groupes: [],
		active: true
	};

	export let allGroupes: Array<Group> = [];

	let newSelectedGroupes: Array<Group> = [];
	let newSelectedItems: Array<Item> = [];

	let mappedData: Array<mappedDataType> = [];

	const mapGroups = (groupId: string) => {
		let active = false;

		const index = findIndexByKeyInArray('_id', groupId, person.groupes);
		if (index != -1) {
			active = true;
		}

		let group = findByKeyInArray('_id', groupId, allGroupes);
		const mappedGroupData = group.items.map((item: any) => {
			if (person?.itemsCanBeAttended?.includes(item._id)) {
				return {
					_id: item._id,
					name: item.name,
					description: item.description,
					groupActive: true
				};
			} else {
				return {
					_id: item._id,
					name: item.name,
					description: item.description,
					groupActive: false
				};
			}
		});

		mappedData.push({
			_id: group._id,
			name: group.name,
			descriptions: group.description,
			activeInGroup: active,
			items: [...mappedGroupData]
		});
	};

	const setSelectedGroupsAndItems = (mappedData: Array<mappedDataType>) => {
		mappedData.forEach((mappedDataItem: mappedDataType) => {
			if (mappedDataItem.activeInGroup === true) {
				newSelectedGroupes = addItemToArrayIfNotAlreadyThere(
					newSelectedGroupes,
					mappedDataItem._id
				);
			} else {
				newSelectedGroupes = removeItemFromArray(newSelectedGroupes, mappedDataItem._id);
			}

			mappedDataItem.items.forEach((item) => {
				if (item.groupActive == true) {
					newSelectedItems = addItemToArrayIfNotAlreadyThere(newSelectedItems, item._id);
				} else {
					newSelectedItems = removeItemFromArray(newSelectedItems, item._id);
				}
			});
		});
	};

	allGroupes.forEach((group) => {
		mapGroups(group._id);
	});
	setSelectedGroupsAndItems(mappedData);

	onMount(async () => {
		itemCheckStates = allItems.map((item: any) => {
			let itemSummary = {
				_id: item._id,
				name: item.name,
				checked: false
			};
			if (person?.itemsCanBeAttended?.includes(item._id)) {
				itemSummary.checked = true;
			}

			return itemSummary;
		});
	});

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		dispatch('submit', {
			_id: person._id || '',
			name: person.name,
			itemsCanBeAttended: newSelectedItems,
			groupes: newSelectedGroupes,
			active: person.active
		});
	}

	const handleToggleChange = (event: CustomEvent<mappedDataType>, id: string) => {
		const index = findIndexByKeyInArray('_id', id, mappedData);

		mappedData[index].activeInGroup = event.detail.activeInGroup;
		if (mappedData[index].activeInGroup == true) {
			mappedData[index].items = mappedData[index].items.map((item) => {
				return {
					...item,
					groupActive: true
				};
			});
		}

		setSelectedGroupsAndItems(mappedData);
	};
</script>

<h1>{title}</h1>

<div class="flex w-full">
	<div class="bg-base-300 rounded-box w-80 p-4">
		<TextInput
			inputLabel={'Name'}
			inputPlaceholder="Name"
			bind:textValue={person.name}
			class="input-accent"
		/>

		<label class="cursor-pointer label">
			<span class="label-text">Active</span>
			<input type="checkbox" class="toggle toggle-primary" bind:checked={person.active} />
		</label>
	</div>
	<div class="divider divider-horizontal" />

	<div class="bg-base-300 rounded-box w-80 p-4">
		{#each mappedData as groupData}
			<GroupToggle
				data={groupData}
				on:change={(event) => handleToggleChange(event, groupData._id)}
			/>
		{/each}
	</div>
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
