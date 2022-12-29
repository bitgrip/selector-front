<script lang="ts">
	import type { Item } from '$lib/types/item';
	import { ColorStyle } from '$lib/types/styles';
	import { LocalApiItems } from '$lib/apiClient/items';
	import type { Event } from '$lib/types/event';
	import { getActiveEvents, getEventsWithFutureDates } from 'utils/date';
	import EventDetailCompact from 'components/events/EventDetailCompact.svelte';
	import Icon from 'components/general/Icon.svelte';
	import { onMount } from 'svelte';
	import Link from 'components/general/Link.svelte';

	export let item: Item;
	let colorStyle: ColorStyle = ColorStyle.primary;

	let isLoading = true;
	let lastFewEvents: Array<Event>;
	let futureEvents: Array<Event>;
	let runningEvents: Array<Event>;

	onMount(async () => {
		await fetchEvents();
		isLoading = false;
	});

	const fetchEvents = async () => {
		lastFewEvents = await LocalApiItems.getItemEvents(item._id, 'all', '10');
		futureEvents = getEventsWithFutureDates(lastFewEvents);
		runningEvents = getActiveEvents(lastFewEvents);
	};
</script>

<div class="mt-4">
	<h2 class="text-{colorStyle} card-title">
		<Link
			href={`/items/${item._id}`}
			text={item.name}
			linkOnHover={true}
			type={ColorStyle.accent}
		/>
	</h2>
	<div class="flex flex-col w-full lg:flex-row">
		<div class="grid w-2/4 card bg-base-300 rounded-box place-items-center">
			<div class="flex flex-row items-center justify-center">
				<h4>
					Running Events ({runningEvents?.length})
				</h4>
				{#if runningEvents?.length > 0}
					<Icon icon="faUpDown" />
				{/if}
			</div>

			<div class="h-40 carousel carousel-vertical carousel-center	 rounded-box w-full">
				{#each runningEvents || [] as event}
					<div class="carousel-item h-full w-full">
						<EventDetailCompact {event} runningEvent={true} />
					</div>
				{/each}
			</div>
		</div>
		<div class="divider lg:divider-horizontal" />
		<div class="grid  w-2/4 card bg-base-300 rounded-box place-items-center">
			<div class="flex flex-row items-center justify-center">
				<h4>
					Planned Events ({futureEvents?.length})
				</h4>
				{#if futureEvents?.length > 0}
					<Icon icon="faUpDown" />
				{/if}
			</div>
			<div class="h-40 carousel carousel-vertical carousel-center	 rounded-box w-full">
				{#each futureEvents || [] as event}
					<div class="carousel-item h-full w-full">
						<EventDetailCompact {event} futureEvent={true} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
