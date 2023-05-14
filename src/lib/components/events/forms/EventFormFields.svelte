<script lang="ts">
	import type { Event, EventRequestType } from '$lib/types/event';
	import type { Item } from '$lib/types/item';
	import type { Role } from '$lib/types/role';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import DateInput from 'components/forms/DateInput.svelte';
	import SelectDropdown from 'components/forms/SelectDropdown.svelte';
	import TextField from 'components/forms/TextField.svelte';
	import RoleParticipantNumber from 'components/roles/RoleParticipantNumber.svelte';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { replaceKeyValueInToArrayIfKeyExistOrAdd } from 'utils/arrayUtils';

	export let formValidation = {
		startDateMissing: false,
		endDateMissing: false
	};

	export let peopleToSelectFrom: Array<SvelteSelectableItem> = [];

	export let event: Event = {
		_id: '',
		item: {
			_id: '',
			description: '',
			isLongerThenOneDay: false,
			longDescription: '',
			usualLenght: 0,
			name: '',
			groupes: [],
			roles: []
		},
		startDate: '',
		endDate: '',
		eventNote: '',
		participants: []
	};

	console.log(event);

	export let formEvent: Event = {
		_id: event?._id || '',
		item: event?.item || {
			_id: '',
			description: '',
			isLongerThenOneDay: false,
			usualLenght: 0,
			longDescription: '',
			name: '',
			groupes: [],
			roles: []
		},
		startDate: event?.startDate || '',
		endDate: event?.endDate || '',
		eventNote: event?.eventNote || '',
		participants: event?.participants || []
	};

	export let item: Item = {
		_id: '',
		roles: [],
		groupes: [],
		isLongerThenOneDay: false,
		usualLenght: 0,
		name: '',
		description: '',
		longDescription: ''
	};

	console.log(peopleToSelectFrom);
	let selectedParticipantsIds: Array<{
		role: string;
		person: string;
	}> = [];

	let endDateModified: boolean | undefined = undefined;

	// there is some kind of weird bug, when binding directly to formEvent.eventNote there is some weird rerender, calling getNamesForRole...
	// but this looks to work ok :)
	let auxEventNote: string;
	$: formEvent.eventNote = auxEventNote;
	// end of weird bug

	onMount(async () => {
		console.log('rerender');
		console.log(event);
		event.participants.forEach((participant) => {
			selectedParticipantsIds.push({
				role: participant.role._id,
				person: participant.person._id
			});
		});
		console.log(selectedParticipantsIds);
		auxEventNote = event.eventNote || '';
	});

	let startDate = event.startDate || new Date().toDateString();
	let endDate: EventRequestType['endDate'] = event.endDate ? event.endDate : '';

	$: if (item.isLongerThenOneDay === false) {
		endDate = startDate;
	}

	$: if (
		item.isLongerThenOneDay === true &&
		item.usualLenght &&
		item.usualLenght > 0 &&
		endDateModified !== undefined &&
		endDateModified === false
	) {
		endDate = dayjs(startDate)
			.add(item.usualLenght - 1, 'day')
			.toString();
	}

	// creating new event, automatically fill in end date
	$: if (
		item.isLongerThenOneDay === true &&
		item.usualLenght &&
		item.usualLenght > 0 &&
		endDateModified === undefined &&
		endDate === ''
	) {
		endDate = dayjs(startDate)
			.add(item.usualLenght - 1, 'day')
			.toString();
	}

	$: formEvent.startDate = startDate;
	$: formEvent.endDate = endDate;
	$: formEvent.participants = selectedParticipantsIds;

	const getNamesForRole = (role: Role): string | string[] => {
		console.log('why is this called');
		console.log(role);
		let person = '';
		let personNameArray: string[] = [];
		if (role.canHaveMultipleParticipants) {
			console.log(event.participants);
			event.participants.forEach((participant) => {
				if (participant.role._id == role._id) {
					personNameArray.push(participant.person._id);
				}
			});
			console.log(personNameArray);
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
			console.log(selectedParticipantsIds);
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

<div class="p-4">
	<form id="eventForm" class="mt-4">
		<DateInput
			isRequired={true}
			inputLabel="Start date"
			class={`${formValidation.startDateMissing ? 'input-error' : 'input-primary'}`}
			bind:date={startDate}
			on:onUserInteraction={() => {
				formValidation.startDateMissing = false;
				endDateModified = false;
				console.log({ endDateModified });
			}}
		/>

		{#if item.isLongerThenOneDay}
			<DateInput
				isRequired={true}
				inputLabel={`${
					item.usualLenght && item.usualLenght > 0
						? `End date (predefined length ${item.usualLenght} days)`
						: 'End date'
				}`}
				class={`${formValidation.endDateMissing ? 'input-error' : 'input-primary'}`}
				date={endDate}
				on:onUserInteraction={(event) => {
					formValidation.endDateMissing = false;
					endDateModified = true;
					endDate = event.detail.toString();
				}}
			/>
		{/if}

		{#if item.roles}
			{#each item.roles as role, i}
				<div class="m-1">
					<div class="flex flex-row items-center">
						<RoleParticipantNumber canHaveMultipleParticipants={role.canHaveMultipleParticipants} />
						<span class="label-text"> {role.name}</span>
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
			class="textarea-primary leading-tight h-15 w-full"
			inputPlaceholder="Optional event note"
			bind:textValue={auxEventNote}
		/>
	</form>
</div>
