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

	const dispatch = createEventDispatcher<{ submit: EventRequestType; close: void }>();

	function close() {
		dispatch('close');
	}

	function submit() {
		formEvent.startDate = dayjs(startDate)
			.set('hour', 7)
			.set('minute', 0)
			.set('second', 0)
			.toDate()
			.toISOString();
		formEvent.endDate = dayjs(endDate)
			.set('hour', 18)
			.set('minute', 0)
			.set('second', 0)
			.toDate()
			.toISOString();
		formEvent.participants = selectedParticipantsIds;
		formEvent._id = event._id || undefined;

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

<h1>{title}</h1>

<div class="item">
	Start Date
	<DateInput bind:date={startDate} />
</div>

{#if item.isLongerThenOneDay}
	<div class="item">
		End Date
		<DateInput bind:date={endDate} />
	</div>
{/if}

{#if item.roles}
	{#each item.roles as role, i}
		<div class="item">
			{role.name}
			<SelectDropdown
				items={peopleToSelectFrom}
				placeholder={'Select..'}
				value={getNameForRoleId(role._id)}
				on:dropdownSelect={(e) => handleSelect(e, role._id)}
			/>
		</div>
	{/each}
{/if}
<div class="button-group">
	<button
		class="btn btn-outline btn-error"
		type="button"
		on:click={() => {
			close();
		}}>Close</button
	>
	<button type="button" class="btn btn-outline btn-primary" on:click={submit}>Save</button>
</div>

<style>
	.item {
		padding: 0.3em;
	}

	.button-group {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 2em 0;
	}
</style>
