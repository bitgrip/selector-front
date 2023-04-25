<script lang="ts">
	import type { Group } from '$lib/types/group';
	import type { Item } from '$lib/types/item';
	import type { Person } from '$lib/types/person';
	import TextInput from 'components/forms/TextInput.svelte';
	import GroupToggle, { type mappedDataType } from 'components/forms/GroupToggle.svelte';
	import { onMount } from 'svelte';
	import {
		addItemToArrayIfNotAlreadyThere,
		findByKeyInArray,
		findIndexByKeyInArray,
		removeItemFromArray
	} from 'utils/arrayUtils';

	export let formValidation = {
		nameInputIsMissing: false
	};

	let itemCheckStates = [];
	export let allItems: Array<Item> = [];

	export let person: Person = {
		_id: '',
		name: '',
		itemsCanBeAttended: [],
		groupes: [],
		active: true
	};

	export let formPerson: Person = {
		_id: person?._id || '',
		name: person?.name || '',
		itemsCanBeAttended: person?.itemsCanBeAttended || [],
		groupes: person?.groupes || [],
		active: person?.active || false
	};

	export let allGroupes: Array<Group> = [];

	let newSelectedGroupes: Array<Group> = [];
	let newSelectedItems: Array<Item> = [];

	let mappedData: Array<mappedDataType> = [];

	$: formPerson.groupes = newSelectedGroupes;
	$: formPerson.itemsCanBeAttended = newSelectedItems;

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

<div class="p-4">
	<form id="personForm" class="mt-4">
		<div class="flex flex-col w-full lg:flex-row mt-2">
			<div class="lg:w-80 w-full bg-base-300 rounded-box p-4">
				<TextInput
					isRequired={true}
					inputLabel={'Name'}
					class={`${formValidation.nameInputIsMissing ? 'input-error' : 'input-accent'}`}
					inputPlaceholder="Name"
					bind:textValue={formPerson.name}
					on:onUserInteraction={() => {
						formValidation.nameInputIsMissing = false;
					}}
				/>

				<label class="cursor-pointer label">
					<span class="label-text">Active</span>
					<input type="checkbox" class="toggle toggle-primary" bind:checked={formPerson.active} />
				</label>
			</div>
			<div class="divider divider-horizontal" />

			<div class="lg:mt-0 mt-4 lg:w-80 w-full bg-base-300 rounded-box p-4">
				{#each mappedData as groupData}
					<GroupToggle
						data={groupData}
						on:change={(event) => handleToggleChange(event, groupData._id)}
					/>
				{/each}
			</div>
		</div>
	</form>
</div>
