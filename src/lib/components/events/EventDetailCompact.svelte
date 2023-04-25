<script lang="ts">
	import type { Event } from '$lib/types/event';
	import type { Participant } from '$lib/types/participant';
	import { ColorStyle, TypeStyle } from '$lib/types/styles';
	import type { TimeStruct } from '$lib/types/utils';
	import Counter from 'components/general/Counter.svelte';
	import ItemLink from 'components/items/ItemLink.svelte';
	import PersonLink from 'components/people/PersonLink.svelte';
	import RoleBadge from 'components/roles/RoleBadge.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { getRemainingTime } from 'utils/date';

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
		participants: [],
		startDate: '',
		endDate: ''
	};

	event.participants = event.participants as Participant[];
	export let runningEvent = false;
	export let futureEvent = false;
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

<div class="card w-full bg-neutral shadow-xl overflow-visible p-6 h-40 ">
	{#if event.item && showItemDetails}
		<h4>
			<ItemLink item={event.item} />
		</h4>
	{/if}

	<div class="flex flex-row justify-between">
		<div>
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
				<Counter days={timeToStart.days} hours={timeToStart.hours} textSize="2lx" />
			{/if}
		</div>
		<div>
			{#each event.participants as participant}
				<div>
					<RoleBadge type={TypeStyle.ghost} role={participant.role} />:
					<PersonLink person={participant.person} type={ColorStyle.neutral} />
				</div>
			{/each}
		</div>
	</div>
	{#if event.eventNote}
		Note: {event.eventNote}
	{/if}
</div>
