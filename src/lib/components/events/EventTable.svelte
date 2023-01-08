<script context="module" lang="ts">
	export type TableDataType = {
		startDate: string;
		endDate: string;
		id: string;
	} & {
		[key: string]: string;
	};
</script>

<script lang="ts">
	import Grid from 'gridjs-svelte';
	import 'gridjs/dist/theme/mermaid.css';
	import { onMount } from 'svelte';
	import { SvelteWrapper } from 'gridjs-svelte/plugins';
	import { createEventDispatcher } from 'svelte';
	import { camelize } from 'utils/stringUtils';
	import { addToArrayIfKeyValueDoesntExist } from 'utils/arrayUtils';
	import { compareDates, formatDate } from 'utils/date';
	import EventTableButton from './EventTableButton.svelte';
	import type { Event } from '$lib/types/event';
	import type { TColumn, TDataArrayRow } from 'gridjs/dist/src/types';

	const dispatch = createEventDispatcher();

	export let eventsToShow: Event[] = [];
	export let itemHasIntervalTracking = false;

	let mappedTableData: TableDataType[] = [];

	// TODO fix this so the columns can be type of TColumn[]?
	// let columns: TColumn[] = [];
	let columns: any = [];

	let participantTableHeaderTitles: TColumn[] = [];

	const getParticipantTitles = (events: Event[]) => {
		events.forEach((event) => {
			event.participants.forEach((participant) => {
				const aux = {
					id: camelize(participant.role.name),
					name: participant.role.name
				};

				participantTableHeaderTitles = addToArrayIfKeyValueDoesntExist(
					participantTableHeaderTitles,
					'id',
					aux
				);
			});
		});
	};

	onMount(async () => {
		getParticipantTitles(eventsToShow);
	});

	let mapDataNew = (events: Event[]) => {
		let roleWithNamesForTableData: {
			[key: string]: string;
		} = {};

		return events.map((event) => {
			roleWithNamesForTableData = {};
			event.participants.forEach((participant) => {
				if (roleWithNamesForTableData[camelize(participant.role.name)]) {
					roleWithNamesForTableData[camelize(participant.role.name)] = `${
						roleWithNamesForTableData[camelize(participant.role.name)]
					}, ${participant.person.name} `;
				} else {
					roleWithNamesForTableData = {
						...roleWithNamesForTableData,
						[camelize(participant.role.name)]: participant.person.name
					};
				}
			});
			return {
				startDate: formatDate(event.startDate),
				endDate: event.endDate ? formatDate(event.endDate) : '',
				id: event._id,
				...roleWithNamesForTableData
			};
		});
	};

	let mapColumns = () => {
		return [
			{
				name: 'id',
				hidden: true
			},
			{
				name: 'startDate',
				id: 'startDate',
				sort: {
					compare: (a: Date, b: Date): number => {
						return compareDates<Date>(a, b);
					}
				}
			},
			{
				name: 'endDate',
				id: 'endDate',
				hidden: !itemHasIntervalTracking,
				sort: {
					compare: (a: Date, b: Date): number => {
						return compareDates<Date>(a, b);
					}
				}
			},

			...participantTableHeaderTitles,
			{
				id: 'Edit',
				sort: false,
				width: '5%',
				data: (row: TDataArrayRow) => {
					return {
						row,
						submitFce: submitEdit,
						icon: 'faPen',
						iconStyles: 'text-neutral-content hover:text-accent'
					};
				},
				plugin: {
					component: SvelteWrapper,
					props: {
						component: EventTableButton
					}
				}
			},
			{
				id: 'Delete',
				sort: false,
				width: '5%',
				data: (row: TDataArrayRow) => {
					return {
						row,
						submitFce: submitDelete,
						icon: 'faTrash',
						iconStyles: 'neutral-content hover:text-error'
					};
				},
				plugin: {
					component: SvelteWrapper,
					props: {
						component: EventTableButton
					}
				}
			}
		];
	};

	// TODO what would be this type?
	let grid: any;

	$: {
		if (grid) {
			mappedTableData = mapDataNew(eventsToShow);
			columns = mapColumns();
			grid.updateConfig({ data: mappedTableData, columns: columns }).forceRender();
		}
	}

	function submitEdit(eventId: Event['_id']) {
		dispatch('submitEdit', {
			eventId
		});
	}

	function submitDelete(eventId: Event['_id']) {
		dispatch('submitDelete', {
			eventId
		});
	}
	const className = {
		container: 'event-table'
	};
</script>

<Grid
	bind:instance={grid}
	data={mappedTableData}
	{columns}
	pagination={true}
	sort={true}
	{className}
/>

<style global>
	/* @import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css'; */

	.event-table tr:hover td {
		background: hsl(var(--nf));
	}

	[data-column-id='Edit'] div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	[data-column-id='Delete'] div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.event-table {
		line-height: 1;
	}
	.event-table td {
		background: hsl(var(--n));
		color: hsl(var(--bc));
		border-color: hsl(var(--nf));
	}

	.event-table th {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
		border-color: hsl(var(--nf));
	}

	.event-table th:hover {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
	}

	.event-table .gridjs-footer {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
		border: none;
	}

	.event-table .gridjs-pagination {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
	}

	.gridjs-table {
		border: none !important;
		width: 100%;
	}
	.gridjs-wrapper {
		border: none;
		margin: 0 auto;
	}
</style>
