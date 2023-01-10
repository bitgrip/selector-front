<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DateInput from 'components/general/DateInput.svelte';
	import { onMount } from 'svelte';
	import { replaceKeyValueInToArrayIfKeyExistOrAdd } from 'utils/arrayUtils';
	import SelectDropdown from 'components/general/SelectDropdown.svelte';
	import dayjs from 'dayjs';
	import type { Event, EventRequestType } from '$lib/types/event';
	import type { Role } from '$lib/types/role';
	import type { Item } from '$lib/types/item';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import RoleParticipantNumber from 'components/roles/RoleParticipantNumber.svelte';
	import TextField from 'components/general/TextField.svelte';

	export let peopleToSelectFrom: Array<SvelteSelectableItem> = [];
	export let title = '';

	export let event: Event = {
		_id: '',
		item: {
			_id: '',
			description: '',
			isLongerThenOneDay: false,
			longDescription: '',
			name: '',
			groupes: [],
			roles: []
		},
		startDate: '',
		endDate: '',
		eventNote: '',
		participants: []
	};

	export let item: Item = {
		_id: '',
		roles: [],
		groupes: [],
		isLongerThenOneDay: false,
		name: '',
		description: '',
		longDescription: ''
	};

	console.log(peopleToSelectFrom);
	let selectedParticipantsIds: Array<{
		role: string;
		person: string;
	}> = [];

	onMount(async () => {
		event.participants.forEach((participant) => {
			selectedParticipantsIds.push({
				role: participant.role._id,
				person: participant.person._id
			});
		});
	});

	let startDate = event.startDate || new Date().toDateString();
	let endDate: EventRequestType['endDate'] = event.endDate ? event.endDate : '';

	$: if (item.isLongerThenOneDay === false) {
		endDate = startDate;
	}

	const formEvent: EventRequestType = {
		startDate: startDate,
		endDate: endDate,
		eventNote: event.eventNote,
		participants: selectedParticipantsIds
	};
	formEvent.eventNote = event.eventNote || '';

	let startDateMissing = false;
	let endDateMissing = false;

	const dispatch = createEventDispatcher<{ submit: EventRequestType; close: void }>();

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		console.log(startDate);
		console.log(endDate);
		console.log(selectedParticipantsIds);

		if (!startDate || startDate == 'Invalid Date') {
			startDateMissing = true;
		}

		if (!endDate && item.isLongerThenOneDay == true) {
			endDateMissing = true;
		}

		if (startDateMissing || endDateMissing) {
			return;
		}

		formEvent.startDate = dayjs(startDate)
			.set('hour', 7)
			.set('minute', 0)
			.set('second', 0)
			.toDate()
			.toISOString();
		if (item.isLongerThenOneDay) {
			formEvent.endDate = dayjs(endDate)
				.set('hour', 18)
				.set('minute', 0)
				.set('second', 0)
				.toDate()
				.toISOString();
		}
		formEvent.participants = selectedParticipantsIds;

		formEvent._id = event._id || '';

		dispatch('submit', {
			...formEvent
		});
	}

	const getNamesForRole = (role: Role): string | string[] => {
		let person = '';
		let personNameArray: string[] = [];
		if (role.canHaveMultipleParticipants) {
			event.participants.forEach((participant) => {
				if (participant.role._id == role._id) {
					personNameArray.push(participant.person._id);
				}
			});
			return personNameArray;
		} else {
			event.participants.forEach((participant) => {
				if (participant.role._id == role._id) {
					person = participant.person.name;
					return person;
				}
			});
		}
		return person;
	};

	function handleSelect(
		event: CustomEvent<{ [key: number]: SvelteSelectableItem }>,
		roleId: Role['_id'],
		roleWithMultiplePeople: boolean
	) {
		if (!roleWithMultiplePeople) {
			replaceKeyValueInToArrayIfKeyExistOrAdd(selectedParticipantsIds, 'role', {
				role: roleId,
				person: event.detail[0].value
			});
		} else {
			selectedParticipantsIds = selectedParticipantsIds.filter((item) => item.role !== roleId);
			for (const [_key, participantItem] of Object.entries(event.detail)) {
				selectedParticipantsIds.push({
					role: roleId,
					person: participantItem.value
				});
			}
		}
	}
</script>

<div class="p-4 max-w-xs w-xs">
	<h1>{title}</h1>

	<form id="itemForm" class="mt-4" on:submit|preventDefault={onSubmit}>
		<DateInput
			isRequired={true}
			inputLabel="Start date"
			class={`${startDateMissing ? 'input-error' : 'input-primary'}`}
			bind:date={startDate}
			on:onUserInteraction={() => {
				startDateMissing = false;
			}}
		/>

		{#if item.isLongerThenOneDay}
			<DateInput
				isRequired={true}
				inputLabel="End date"
				class={`${endDateMissing ? 'input-error' : 'input-primary'}`}
				bind:date={endDate}
				on:onUserInteraction={() => {
					endDateMissing = false;
				}}
			/>
		{/if}

		{#if item.roles}
			{#each item.roles as role, i}
				<div class="m-1">
					<div class="flex flex-row justify-between">
						<span class="label-text"> {role.name}</span>
						<RoleParticipantNumber canHaveMultipleParticipants={role.canHaveMultipleParticipants} />
					</div>
					<SelectDropdown
						items={peopleToSelectFrom}
						placeholder={`Select ${role.name.toLowerCase()}`}
						multiSelect={role.canHaveMultipleParticipants}
						value={getNamesForRole(role)}
						on:dropdownSelect={(e) => handleSelect(e, role._id, role.canHaveMultipleParticipants)}
					/>
				</div>
			{/each}
		{/if}

		<TextField
			inputLabel={'Optional event notes'}
			class="textarea-primary leading-tight h-15"
			inputPlaceholder="Optional event note"
			bind:textValue={formEvent.eventNote}
		/>

		<div class="mt-4 flex justify-between">
			<button
				class="btn btn-outline btn-error"
				type="button"
				on:click={() => {
					close();
				}}>Close</button
			>
			<button type="submit" class="btn btn-outline btn-accent">Save</button>
		</div>
	</form>
</div>
