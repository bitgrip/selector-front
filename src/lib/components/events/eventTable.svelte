<script>
	// @ts-nocheck

	import Grid from 'gridjs-svelte';
	import { h } from 'gridjs';
	import 'gridjs/dist/theme/mermaid.css';
	import { onMount } from 'svelte';

	import { createEventDispatcher } from 'svelte';
	import { camelize } from 'utils/stringUtils';
	import { addToArrayIfKeyValueDoesntExist } from 'utils/arrayUtils';
	import dayjs from 'dayjs';
	import { formatDate } from 'utils/date';
	const dispatch = createEventDispatcher();

	export let eventsToShow = [];
	export let itemHasIntervalTracking = false;
	let mappedTableData = [];
	let columns = ['startDate', 'endDate'];

	let participantTableHeaderTitles = [];

	const getParticipantTitles = (events) => {
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

	let mapDataNew = (events) => {
		let auxObject = {};
		return events.map((event) => {
			auxObject = {}
			event.participants.forEach((participant) => {
				auxObject = { ...auxObject, [camelize(participant.role.name)]: participant.person.name };
			});

			return {
				startDate: formatDate(event.startDate),
				endDate: event.endDate ? formatDate(event.endDate) : '',
				id: event._id,
				...auxObject
			};
		});
	};

	let mapColumns = (events) => {
		return [
			{
				name: 'id',
				hidden: true
			},
			{
				name: 'startDate',
				id: 'startDate',
				sort: {
					compare: (a, b) => {
						if (!a) return -1;
						const distantFuture = dayjs('02/10/2060');
						const dateA = a ? dayjs(a, 'DD.MM.YYYY') : distantFuture;
						const dateB = b ? dayjs(b, 'DD.MM.YYYY') : distantFuture;
						if (dateA.isBefore(dateB)) {
							return 1;
						} else if (dateB.isBefore(dateA)) {
							return -1;
						} else {
							return 0;
						}
					}
				}
			},
			{
				name: 'endDate',
				id: 'endDate',
				hidden: !itemHasIntervalTracking,
				sort: {
					compare: (a, b) => {
						if (!a) return -1;
						const distantFuture = dayjs('02/10/2060');
						const dateA = a ? dayjs(a, 'DD.MM.YYYY') : distantFuture;
						const dateB = b ? dayjs(b, 'DD.MM.YYYY') : distantFuture;
						if (dateA.isBefore(dateB)) {
							return 1;
						} else if (dateB.isBefore(dateA)) {
							return -1;
						} else {
							return 0;
						}
					}
				}
			},

			...participantTableHeaderTitles,
			{
				name: 'Edit',
				formatter: (cell, row) => {
					return h(
						'button',
						{
							onClick: () => {
								submitEdit(row.cells[0].data);
							}
						},
						'Edit'
					);
				}
			},
			{
				name: 'Delete',
				formatter: (cell, row) => {
					return h(
						'button',
						{
							onClick: () => {
								submitDelete(row.cells[0].data);
							}
						},
						'Delete'
					);
				}
			}
		];
	};

	let grid;

	$: {
		if (grid) {
			mappedTableData = mapDataNew(eventsToShow);
			columns = mapColumns(eventsToShow);
			grid.updateConfig({ data: mappedTableData, columns: columns }).forceRender();
		}
	}

	function submitEdit(eventId) {
		dispatch('submitEdit', {
			eventId
		});
	}

	function submitDelete(eventId) {
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
