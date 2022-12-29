<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import 'gridjs/dist/theme/mermaid.css';
	import { camelize } from 'utils/stringUtils';
	import type { Attendance } from '$lib/types/attendance';
	import type { Item } from '$lib/types/item';
	import { findKeyPositionInArray } from 'utils/arrayUtils';
	import { compareDates, formatDate } from 'utils/date';

	export let data: Attendance = {};
	export let item: Item = {
		_id: '',
		description: '',
		groupes: [],
		isLongerThenOneDay: false,
		name: '',
		roles: []
	};

	let grid: any; // TODO fix this type somehow

	let mappedTableData: Array<{
		name: string;
		active: string;
		[prop: string]: any;
	}>;

	// TODO Solve the problem with sorting function when columns is Array<TColumn>
	// let columns: Array<TColumn>;
	let columns: any;

	let showInactivePeople = false;

	let mapColumns = (item: Item) => {
		let dateColumns: Array<string> = [];

		item.roles.forEach((role) => {
			dateColumns.push(role.name);
			dateColumns.push(`last time in ${role.name}`);
		});

		let mapped = dateColumns.map((i) => {
			if (i.startsWith('last')) {
				return {
					id: camelize(i),
					name: i,
					sort: {
						compare: (a: Date, b: Date): number => {
							return compareDates<Date>(a, b);
						}
					}
				};
			}

			return {
				id: camelize(i),
				name: i,
				width: '15%'
			};
		});

		return [
			{
				id: 'name',
				name: 'name',
				formatter: (cell: any, row: any) =>
					html(`<span class="${row.cells[1].data === 'no' && 'text-error'} ">${cell} </span>`)
			},
			{ id: 'active', name: 'active', width: '6%', hidden: true },
			...mapped
		];
	};

	let mapData = (data: Attendance) => {
		let tableData: Array<{
			name: string;
			active: string;
			[prop: string]: any;
		}> = [];

		for (const key in data) {
			data[key].forEach((roleAttendance) => {
				const position = findKeyPositionInArray([...tableData], 'name', roleAttendance.name);

				if (position !== -1) {
					tableData[position][camelize(key)] = roleAttendance.attended;
					tableData[position][camelize(`last Time In ${key}`)] = roleAttendance.latestDate
						? formatDate(roleAttendance.latestDate)
						: '';
				} else {
					tableData.push({
						name: roleAttendance.name,
						active: roleAttendance.active ? 'yes' : 'no',
						[camelize(key)]: roleAttendance.attended,

						[camelize(`last Time In ${key}`)]: roleAttendance.latestDate
							? formatDate(roleAttendance.latestDate)
							: ''
					});
				}
			});
		}

		if (showInactivePeople === false) {
			let filteredData = tableData.filter((person) => person.active === 'yes');
			return filteredData;
		}
		return tableData;
	};

	mappedTableData = mapData(data);
	columns = mapColumns(item); // TODO Solve the problem with sorting function when columns is Array<TColumn>

	const className = {
		container: 'people-table'
	};

	$: {
		if (grid) {
			mappedTableData = mapData(data);
			columns = mapColumns(item); // TODO Solve the problem with sorting function when columns is Array<TColumn>
			grid.updateConfig({ data: mappedTableData, columns: columns }).forceRender();
		}
	}
</script>

<label class="cursor-pointer label w-40">
	<span class="label-text">show inactive people in the table</span>
	<input
		type="checkbox"
		class="toggle toggle-primary"
		bind:checked={showInactivePeople}
		on:change={() => {
			mappedTableData = mapData(data);
			columns = mapColumns(item); // TODO Solve the problem with sorting function when columns is Array<TColumn>
			grid.updateConfig({ data: mappedTableData, columns: columns }).forceRender();
		}}
	/>
</label>
<Grid bind:instance={grid} data={mappedTableData} {columns} sort={true} {className} />

<style global>
	/* @import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css'; */

	td.gridjs-td {
		word-break: break-all;
	}

	.people-table {
		line-height: 1;
	}

	.people-table tr:hover td {
		background: hsl(var(--nf));
	}

	.people-table td {
		background: hsl(var(--n));
		color: hsl(var(--bc));
		border-color: hsl(var(--nf));
	}

	.people-table th {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
		border-color: hsl(var(--nf));
	}

	.people-table th:hover {
		background: hsl(var(--n));
		color: hsl(var(--af)) !important;
	}

	.gridjs-table {
		border: none !important;
		width: 100%;
	}
	.gridjs-wrapper {
		border: none;
		/* width: 80%;
		max-width: 900px; */
		margin: 0 auto;
	}
</style>
