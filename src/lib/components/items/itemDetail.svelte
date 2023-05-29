<script lang="ts">
	import { LocalApiEvents } from '$lib/apiClient/events.js';
	import { LocalApiItems } from '$lib/apiClient/items';
	import {
		handleCreateNewEvent,
		handleDeleteEvent,
		handleUpdateEvent
	} from '$lib/components/events/eventHandlerFuntions';
	import type { Attendance } from '$lib/types/attendance';
	import type { Event } from '$lib/types/event';
	import type { Item } from '$lib/types/item';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import EventTable from 'components/events/EventTable.svelte';
	import EventFormModal from 'components/events/forms/EventFormModal.svelte';
	import DangerZoneConfirmDeleteActionModal from 'components/general/DangerZoneConfirmDeleteActionModal.svelte';
	import Error from 'components/general/Error.svelte';
	import Load from 'components/general/Load.svelte';
	import PageHeader from 'components/general/PageHeader.svelte';
	import { getAllSelectablePeople } from 'components/people/peopleHandlerFunctions';
	import PeopleTable from 'components/people/peopleTable.svelte';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import ItemEventSummary from './itemEventSummary.svelte';

	export let item: Item;

	let itemEvents: Array<Event> = [];
	let selectablePeople: Array<SvelteSelectableItem> = [];
	let workingEventReference: Event;

	let showCreateEventModalOpened = false;
	let showEditModalOpened = false;
	let showDeleteEventModal = false;

	let isLoading = true;

	let nonExistingItem = false;

	let selected = '10';

	let longInfoParsed = item.longDescription && marked.parse(item.longDescription);

	let showDetailsInEventTable = false;

	onMount(async () => {
		if (item._id) {
			selectablePeople = await getAllSelectablePeople(item._id);
			await fetchAllItemEvents();
			await fetchPeopleAttendance();
			isLoading = false;
		} else {
			nonExistingItem = true;
		}
	});

	const fetchAllItemEvents = async () => {
		itemEvents = await LocalApiItems.getItemEvents(item._id, 'all', '10');
	};

	let peopleAttendance: Attendance = {};

	const fetchPeopleAttendance = async () => {
		peopleAttendance = await LocalApiItems.getItemPeopleAttendance(item._id);
	};
</script>

<svelte:head>
	<title>{`${item.name} tracking | Selector`}</title>
	{#if showCreateEventModalOpened || showEditModalOpened || showDeleteEventModal}
		<style>
			body {
				overflow-y: hidden;
			}
		</style>
	{/if}
</svelte:head>

{#if !nonExistingItem}
	<PageHeader buttonText="Add new event" on:buttonClick={() => (showCreateEventModalOpened = true)}>
		<svelte:fragment slot="title"
			>Detail of <span class="text-accent">{item.name}</span></svelte:fragment
		>
	</PageHeader>

	<div class="mt-16 mb-8">
		{#if isLoading}
			<Load />
		{:else}
			{#if itemEvents.length > 0}
				<ItemEventSummary
					on:delete={(event) => {
						showDeleteEventModal = true;
						workingEventReference = event.detail;
					}}
					on:edit={(event) => {
						showEditModalOpened = true;
						workingEventReference = event.detail;
					}}
					lastFewEvents={itemEvents.slice(-10)}
				/>
			{/if}

			{#if longInfoParsed}
				<div class="md mt-10">
					{@html longInfoParsed}
				</div>
			{/if}
		{/if}
	</div>

	{#if showCreateEventModalOpened}
		<EventFormModal
			class="lg:w-4/12 w-full"
			peopleToSelectFrom={selectablePeople}
			lastItemEvent={itemEvents?.[0] || null}
			{item}
			on:submit={(event) => {
				handleCreateNewEvent(event.detail, item).then(() => {
					showCreateEventModalOpened = false;
					fetchAllItemEvents();
					fetchPeopleAttendance();
				});
			}}
			on:close={() => {
				showCreateEventModalOpened = false;
			}}
		>
			<h1 slot="title">Create new event</h1>
		</EventFormModal>
	{/if}

	{#if showEditModalOpened}
		<EventFormModal
			class="lg:w-4/12 w-full"
			peopleToSelectFrom={selectablePeople}
			{item}
			event={workingEventReference}
			on:submit={(event) => {
				handleUpdateEvent(event.detail).then(() => {
					showEditModalOpened = false;
					fetchAllItemEvents();
					fetchPeopleAttendance();
				});
			}}
			on:close={() => {
				showEditModalOpened = false;
			}}
		>
			<h1 slot="title">Edit event</h1>
		</EventFormModal>
	{/if}

	{#if showDeleteEventModal}
		<DangerZoneConfirmDeleteActionModal
			class="lg:w-1/2"
			subject="Event"
			expectedConfirmationText=""
			on:cancel={() => {
				showDeleteEventModal = false;
			}}
			on:ok={() => {
				isLoading = true;
				handleDeleteEvent(workingEventReference).then(() => {
					fetchAllItemEvents();
					fetchPeopleAttendance();
					isLoading = false;
				});

				showDeleteEventModal = false;
			}}
		>
			<h1 slot="title">Delete confirmation</h1>
			<span slot="confirmation-content"
				>Do you really want to delete this event? You can not reverse this action.
			</span>
		</DangerZoneConfirmDeleteActionModal>
	{/if}

	<h2 class="pt-5">People</h2>

	{#if item && isLoading == false}
		<PeopleTable data={peopleAttendance} {item} />
	{/if}

	<h2 class="pt-5">Event List</h2>

	<!-- TODO refactor this to own component with nicer code -->
	<div class="btn-group">
		<input
			checked={selected === '10'}
			type="radio"
			name="options"
			data-title="10"
			class="btn"
			on:change={async () => {
				selected = '10';
				itemEvents = await LocalApiItems.getItemEvents(item._id, 'all', '10');
			}}
		/>
		<input
			checked={selected === '50'}
			type="radio"
			name="options"
			data-title="50"
			class="btn"
			on:change={async () => {
				selected = '50';
				itemEvents = await LocalApiItems.getItemEvents(item._id, 'all', '50');
			}}
		/>
		<input
			checked={selected === 'all'}
			type="radio"
			name="options"
			data-title="all"
			class="btn"
			on:change={async () => {
				selected = 'all';
				itemEvents = await LocalApiItems.getItemEvents(item._id, 'all');
			}}
		/>
	</div>

	<div>
		<label class="cursor-pointer label">
			<span class="label-text">show event notes</span>
			<input type="checkbox" class="toggle toggle-primary" bind:checked={showDetailsInEventTable} />
		</label>
	</div>

	{#if itemEvents.length > 0}
		<EventTable
			itemHasIntervalTracking={item.isLongerThenOneDay}
			{showDetailsInEventTable}
			on:submitEdit={async (event) => {
				workingEventReference = await LocalApiEvents.getEventById(event.detail.eventId);
				showEditModalOpened = true;
			}}
			on:submitDelete={async (event) => {
				workingEventReference = await LocalApiEvents.getEventById(event.detail.eventId);
				showDeleteEventModal = true;
			}}
			eventsToShow={itemEvents}
		/>
	{/if}
{:else}
	<Error>
		Oh no. Looks like this item doesnt exits.
		<a class={`link`} href="/">Go home.</a>
	</Error>
{/if}

<style>
	:global(.md a) {
		color: hsl(var(--a));
	}

	:global(.md) {
		line-height: 1.2rem;
	}
	:global(.md a:hover) {
		color: hsl(var(--af));
	}
</style>
