<script lang="ts">
	import EventTable from 'components/events/EventTable.svelte';
	import EventForm from 'components/forms/eventForm.svelte';
	import Modal from 'components/general/Modal.svelte';
	import { onMount } from 'svelte';
	import PeopleTable from 'components/people/peopleTable.svelte';
	import { getAllSelectablePeople } from 'components/people/peopleHandlerFunctions';
	import {
		handleCreateNewEvent,
		handleUpdateEvent,
		handleDeleteEvent
	} from '$lib/components/events/eventHandlerFuntions';
	import ConfirmDeleteAction from 'components/general/ConfirmDeleteAction.svelte';
	import { getAllPeopleAndRoleCount, getItemEvents } from './itemHandlerFunctions';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import ItemEventSummary from './itemEventSummary.svelte';
	import Load from 'components/general/Load.svelte';
	import Error from 'components/general/Error.svelte';
	import { LocalApiItems } from '$lib/apiClient/items';
	import type { Item } from '$lib/types/item';
	import type { Event } from '$lib/types/event';
	import { LocalApiEvents } from '$lib/apiClient/events.js';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import { marked } from 'marked';
	import { LocalApiPeople } from '$lib/apiClient/people';
	import type { Attendance } from '$lib/types/attendance';

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
	<meta name="description" content="Tracking of {item.name}: {item.description}" />
</svelte:head>

{#if !nonExistingItem}
	<div class="info">
		<div class="prose max-w-none">
			<h1 class="">Detail of <span class="text-accent">{item.name}</span></h1>
			<button
				class="btn btn-accent"
				on:click={() => {
					showCreateEventModalOpened = true;
				}}><Fa size="lg" class="add-new-tracking-icon" icon={faPlus} /> Add new event</button
			>
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
	</div>

	{#if showCreateEventModalOpened}
		<Modal>
			<EventForm
				title={'Create new event'}
				peopleToSelectFrom={selectablePeople}
				{item}
				on:close={() => {
					showCreateEventModalOpened = false;
				}}
				on:submit={(event) => {
					handleCreateNewEvent(event.detail, item).then(() => {
						showCreateEventModalOpened = false;
						fetchAllItemEvents();
						fetchPeopleAttendance();
					});
				}}
			/>
		</Modal>
	{/if}

	{#if showEditModalOpened}
		<Modal>
			<EventForm
				title={'Edit event'}
				peopleToSelectFrom={selectablePeople}
				event={workingEventReference}
				{item}
				on:close={() => {
					showEditModalOpened = false;
				}}
				on:submit={(event) => {
					handleUpdateEvent(event.detail).then(() => {
						showEditModalOpened = false;
						fetchAllItemEvents();
						fetchPeopleAttendance();
					});
				}}
			/>
		</Modal>
	{/if}

	{#if showDeleteEventModal}
		<Modal>
			<ConfirmDeleteAction
				on:cancel={() => {
					showDeleteEventModal = false;
				}}
				on:ok={() => {
					handleDeleteEvent(workingEventReference).then(() => {
						fetchAllItemEvents();
						fetchPeopleAttendance();
					});
					showDeleteEventModal = false;
				}}
			>
				<svelte:fragment slot="title">Delete confirmation</svelte:fragment>
				<span slot="content"
					>Do you really want to delete this event? You can not reverse this action.
				</span>
			</ConfirmDeleteAction>
		</Modal>
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
	.info {
		margin-top: 5em;
	}

	button {
		margin: 2em;
		margin-left: 0em;
	}

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
