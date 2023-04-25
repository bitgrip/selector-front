<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import type { Event, EventRequestType } from '$lib/types/event';
	import type { Item } from '$lib/types/item';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import Modal from 'components/general/Modal.svelte';
	import EventFormFields from './EventFormFields.svelte';
	import ActionButtons from 'components/forms/ActionButtons.svelte';

	const dispatch = createEventDispatcher<{ submit: EventRequestType; close: void }>();
	$: classesFromTheParent = $$props.class;

	export let peopleToSelectFrom: Array<SvelteSelectableItem> = [];

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

	export let formEventSubmitted: Event = {
		_id: event?._id || '',
		item: event?.item || {
			_id: '',
			description: '',
			isLongerThenOneDay: false,
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
		name: '',
		description: '',
		longDescription: ''
	};

	let formValidation = {
		startDateMissing: false,
		endDateMissing: false
	};

	let saveButtonDisabled = false;

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

	function close() {
		dispatch('close');
	}

	function submit() {
		if (!formEventSubmitted.startDate || formEventSubmitted.startDate == 'Invalid Date') {
			formValidation.startDateMissing = true;
		}

		if (!formEventSubmitted.endDate && item.isLongerThenOneDay == true) {
			formValidation.endDateMissing = true;
		}

		if (formValidation.startDateMissing || formValidation.endDateMissing) {
			saveButtonDisabled = false;
			return;
		}

		saveButtonDisabled = true;
		formEventSubmitted.startDate = dayjs(formEventSubmitted.startDate)
			.set('hour', 7)
			.set('minute', 0)
			.set('second', 0)
			.toDate()
			.toISOString();
		if (item.isLongerThenOneDay) {
			formEventSubmitted.endDate = dayjs(formEventSubmitted.endDate)
				.set('hour', 18)
				.set('minute', 0)
				.set('second', 0)
				.toDate()
				.toISOString();
		} else {
			formEventSubmitted.endDate = '';
		}

		dispatch('submit', {
			...formEventSubmitted
		});
	}
</script>

<Modal class={classesFromTheParent} on:clickOutside={() => close()}>
	<slot name="title" slot="modal-title" />

	<svelte:fragment slot="modal-content">
		<EventFormFields
			bind:formEvent={formEventSubmitted}
			{peopleToSelectFrom}
			{item}
			{event}
			{formValidation}
		/>
	</svelte:fragment>

	<svelte:fragment slot="modal-buttons">
		<ActionButtons on:save={() => submit()} on:close={() => close()} {saveButtonDisabled} />
	</svelte:fragment>
</Modal>
