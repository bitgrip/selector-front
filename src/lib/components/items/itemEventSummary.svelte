<script lang="ts">
	import { getActiveEvents, getEventsWithFutureDates, getLastEvent } from 'utils/date';
	import EventGroupOverview from 'components/events/EventGroupOverview.svelte';
	import type { Event } from '$lib/types/event';

	export let lastFewEvents: Array<Event> = [];

	let runningEvents: Array<Event> = [];
	let futureEvents: Array<Event> = [];

	$: futureEvents = getEventsWithFutureDates(lastFewEvents);
	$: runningEvents = getActiveEvents(lastFewEvents);

	console.log(lastFewEvents);
	console.log(futureEvents);
	console.log(runningEvents);
</script>

<div class="flex flex-wrap ">
	<EventGroupOverview runningEvent={true} eventArray={runningEvents} on:delete on:edit>
		<svelte:fragment slot="title">Events running</svelte:fragment>
	</EventGroupOverview>

	<EventGroupOverview futureEvent={true} eventArray={futureEvents} on:delete on:edit>
		<svelte:fragment slot="title">Comming up...</svelte:fragment>
	</EventGroupOverview>
</div>
