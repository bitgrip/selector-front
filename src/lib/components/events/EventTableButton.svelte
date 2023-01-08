<script lang="ts">
	import Icon from 'components/general/Icon.svelte';
	import type { TableDataType } from './EventTable.svelte';

	export let cell: {
		data: {
			icon: string;
			iconStyles: string;
			row: TableDataType;
			submitFce: (id: string) => {};
		};

		id: string;
	};
</script>

<button
	on:click={() => {
		cell.data.submitFce(cell.data.row.id);
	}}
>
	<Icon icon={cell.data.icon} cssClass={cell.data.iconStyles} />
</button>
