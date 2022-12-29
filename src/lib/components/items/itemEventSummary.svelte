<script lang="ts">
	import { onMount } from 'svelte';
	import { getActiveEvents, getEventsWithFutureDates, getLastEvent } from 'utils/date';
	import EventGroupOverview from 'components/events/EventGroupOverview.svelte';
	import type { Event } from '$lib/types/event';

	export let lastFewEvents: Array<Event> = [];

	let runningEvents: Array<Event> = [];
	let futureEvents: Array<Event> = [];

	onMount(async () => {
		futureEvents = getEventsWithFutureDates(lastFewEvents);
		runningEvents = getActiveEvents(lastFewEvents);
	});
</script>

<EventGroupOverview runningEvent={true} eventArray={runningEvents}>
	<svelte:fragment slot="title">Events running</svelte:fragment>
	<p slot="noEventsText">No running events!</p>
</EventGroupOverview>

<EventGroupOverview futureEvent={true} eventArray={futureEvents}>
	<svelte:fragment slot="title">Comming up...</svelte:fragment>
	<p slot="noEventsText">No comming up event, maybe define one?</p>
</EventGroupOverview>
