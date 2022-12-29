<script lang="ts">
	import type { Event } from '$lib/types/event';
	import EventDetail from './EventDetail.svelte';

	export let eventArray: Event[] = [];
	export let highlightPersonId = '';
	export let runningEvent = false;
	export let futureEvent = false;
	export let showItemDetails = false;
</script>

<div class="w-full mt-10">
	<h4 class="text-2xl font-bold">
		<slot name="title" />
	</h4>

	<div class="flex flex-wrap flex-row gap-9 ">
		{#if eventArray.length > 0}
			{#each eventArray as event}
				<EventDetail {showItemDetails} {runningEvent} {futureEvent} {event} {highlightPersonId} />
			{/each}
		{:else}
			<slot name="noEventsText" />
		{/if}
	</div>
</div>
