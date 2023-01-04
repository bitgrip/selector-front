<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DateInput from 'components/general/DateInput.svelte';
	import { onMount } from 'svelte';
	import { replaceKeyValueInToArrayIfKeyExistOrAdd } from 'utils/arrayUtils';
	import SelectDropdown from 'components/general/SelectDropdown.svelte';
	import dayjs from 'dayjs';
	import type { Person } from '$lib/types/person';
	import type { Event, EventRequestType } from '$lib/types/event';
	import type { Role } from '$lib/types/role';
	import type { Item } from '$lib/types/item';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';

	export let peopleToSelectFrom: Array<SvelteSelectableItem> = [];
	export let title = '';

	export let event: Event = {
		_id: '',
		item: {
			_id: '',
			description: '',
			isLongerThenOneDay: false,
			name: '',
			groupes: [],
			roles: []
		},
		startDate: '',
		endDate: '',
		participants: []
	};

	export let item: Item = {
		_id: '',
		roles: [],
		groupes: [],
		isLongerThenOneDay: false,
		name: '',
		description: ''
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
		participants: selectedParticipantsIds
	};

	let startDateMissing = false;
	let endDateMissing = false;

	const dispatch = createEventDispatcher<{ submit: EventRequestType; close: void }>();

	function close() {
		dispatch('close');
	}

	function onSubmit() {
		console.log(startDate);
		console.log(endDate);

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

	const getNameForRoleId = (roleId: Role['_id']): string => {
		let person = '';
		event.participants.forEach((participant) => {
			if ((participant.role as Role)._id == roleId) {
				person = (participant.person as Person).name;
				return;
			}
		});
		return person;
	};

	function handleSelect(event: CustomEvent<SvelteSelectableItem>, roleId: Role['_id']) {
		replaceKeyValueInToArrayIfKeyExistOrAdd(selectedParticipantsIds, 'role', {
			role: roleId,
			person: event.detail.value
		});
	}
</script>

<div class="p-4">
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
					<span class="label-text"> {role.name}</span>
					<SelectDropdown
						items={peopleToSelectFrom}
						placeholder={`Select ${role.name.toLowerCase()}`}
						value={getNameForRoleId(role._id)}
						on:dropdownSelect={(e) => handleSelect(e, role._id)}
					/>
				</div>
			{/each}
		{/if}
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
