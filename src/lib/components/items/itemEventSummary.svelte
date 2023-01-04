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

<div class="flex flex-wrap ">
	<EventGroupOverview runningEvent={true} eventArray={runningEvents}>
		<svelte:fragment slot="title">Events running</svelte:fragment>
	</EventGroupOverview>

	<EventGroupOverview futureEvent={true} eventArray={futureEvents}>
		<svelte:fragment slot="title">Comming up...</svelte:fragment>
	</EventGroupOverview>
</div>
