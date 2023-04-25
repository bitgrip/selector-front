<script context="module" lang="ts">
	export type mappedDataType = {
		activeInGroup: boolean;
		descriptions: string;
		items: Array<Item & { groupActive: boolean }>;
		name: string;
		_id: string;
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Item } from '$lib/types/item';

	const dispatch = createEventDispatcher<{ change: mappedDataType }>();

	export let data: mappedDataType = {
		activeInGroup: false,
		descriptions: '',
		items: [],
		name: '',
		_id: ''
	};

	function onChange() {
		dispatch('change', {
			...data
		});
	}
</script>

<form on:change={onChange}>
	<label class="cursor-pointer label">
		<span class="label-text">{data.name}</span>
		<input type="checkbox" class="toggle toggle-secondary" bind:checked={data.activeInGroup} />
	</label>

	<div class="flex flex-col	">
		{#each data.items || [] as item}
			<div>
				<label class="label cursor-pointer">
					<span class="label-text">{item.name}</span>
					<input
						type="checkbox"
						bind:checked={item.groupActive}
						disabled={data.activeInGroup ? true : false}
						class="checkbox checkbox-primary"
					/>
				</label>
			</div>
		{/each}
	</div>
</form>
