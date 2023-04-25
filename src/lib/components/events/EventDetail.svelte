<script lang="ts">
	import type { Event } from '$lib/types/event';
	import type { Participant } from '$lib/types/participant';
	import { ColorStyle, TypeStyle } from '$lib/types/styles';
	import type { TimeStruct } from '$lib/types/utils';
	import Card from 'components/general/Card.svelte';
	import Counter from 'components/general/Counter.svelte';
	import ItemLink from 'components/items/ItemLink.svelte';
	import PersonLink from 'components/people/PersonLink.svelte';
	import RoleBadge from 'components/roles/RoleBadge.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { createEventDispatcher } from 'svelte';
	import { formatDate, getRemainingTime } from 'utils/date';

	const dispatch = createEventDispatcher<{ delete: Event; edit: Event }>();

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
		participants: [],
		startDate: '',
		endDate: '',
		eventNote: ''
	};

	event.participants = event.participants as Participant[];
	export let runningEvent = false;
	export let futureEvent = false;
	export let highlightPersonId: Event['_id'] = '';
	export let showItemDetails = false;

	dayjs.extend(relativeTime);

	let timeToEnd: TimeStruct = {};
	// some old events may not have enddate set up but now events should have one (one day events is start date and end date identical)
	if (event.item.isLongerThenOneDay === true) {
		timeToEnd = getRemainingTime(new Date(event.endDate));
	} else {
		if (event.endDate) {
			timeToEnd = getRemainingTime(new Date(event.endDate));
		} else {
			timeToEnd = getRemainingTime(new Date(event.startDate));
		}
	}

	const timeToStart = getRemainingTime(new Date(event.startDate));
</script>

<Card
	testId="EventCard"
	class="mb-4 lg:mb-0 lg:w-3/12 w-full min-w-fit"
	on:deleteTrigger={() => {
		dispatch('delete', {
			...event
		});
	}}
	on:settingsTrigger={() => {
		dispatch('edit', {
			...event
		});
	}}
>
	<div slot="title">
		{#if event.item && showItemDetails}
			<h4
				class="text-accent no-underline hover:text-accent-focus transform transition duration-500"
			>
				<ItemLink item={event.item} />
			</h4>
		{/if}
	</div>

	<div slot="content" class="prose flex flex-col">
		{#if runningEvent}
			{#if event.item.isLongerThenOneDay === true}
				Ends in
				<Counter days={timeToEnd.days} hours={timeToEnd.hours} textSize={'text-4xl'} />
			{:else}
				Ends
				<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
					<span class={`countdown font-mono text-4xl`}> Today </span>
				</div>
			{/if}
		{:else if futureEvent}
			Starts in
			<Counter days={timeToStart.days} hours={timeToStart.hours} textSize={'text-4xl'} />
		{/if}
		<br />
		{event.endDate && event.endDate
			? `from ${formatDate(event.startDate)} to ${formatDate(event.endDate)}`
			: `on ${formatDate(event.startDate)}`}
		<br />

		{#each event.participants as participant}
			<div>
				<RoleBadge
					type={highlightPersonId === participant.person._id ? TypeStyle.primary : TypeStyle.ghost}
					role={participant.role}
				/> <PersonLink
					person={participant.person}
					type={highlightPersonId === participant.person._id
						? ColorStyle.primary
						: ColorStyle.neutral}
				/>
			</div>
		{/each}
		<br />
		<div class="max-w-xs">
			{#if event.eventNote}
				Note: {event.eventNote}
			{/if}
		</div>
	</div>
</Card>
