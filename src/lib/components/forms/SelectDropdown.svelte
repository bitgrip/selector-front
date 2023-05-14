<script lang="ts">
	import Select from 'svelte-select';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SvelteSelectEvent } from '$lib/types/svelte-select/event';
	import type { SvelteSelectableItem } from '$lib/types/svelte-select/detail';
	import { removeFromArrayBasedOnKey } from 'utils/arrayUtils';

	export let items: Array<SvelteSelectableItem> = [];

	export let placeholder = '';
	export let value: string | string[] = '';
	export let colorStyle = 'primary';
	export let multiSelect = false;

	$: classesFromTheParent = $$props.class;

	let selectedItems: Array<SvelteSelectableItem> = [];

	$: placeholderAlwaysShow = selectedItems.length === 0 ? true : false;

	let visible = false;
	onMount(async () => {
		if (value instanceof Array) {
			value.map((item) => {
				selectedItems.push({ value: item, label: '' });
			});
		}
		visible = true;
		placeholderAlwaysShow = selectedItems.length === 0 ? true : false;
	});
	const dispatch = createEventDispatcher<{
		dropdownSelect: { [key: number]: SvelteSelectableItem };
	}>();

	const handleSelect = (e: SvelteSelectEvent) => {
		if (e.detail instanceof Array) {
			selectedItems = e.detail;
		} else {
			selectedItems = [
				{
					value: e.detail.value,
					label: e.detail.label
				}
			];
		}

		dispatch('dropdownSelect', {
			...selectedItems
		});
	};

	const handleClear = (e: SvelteSelectEvent) => {
		removeFromArrayBasedOnKey('value', e.detail.value, selectedItems);
		dispatch('dropdownSelect', {
			...selectedItems
		});
	};

	let floatingConfig = {
		strategy: 'fixed'
	};
</script>

<div class="themed-select-{colorStyle} {classesFromTheParent}">
	<!-- render the component after it is clear if  placeholderAlwaysShow for multiple select dropdowns is true of false, once
	rendered, it can not be changed -->
	{#if visible}
		<Select
			{floatingConfig}
			id="dropdown"
			{items}
			multiple={multiSelect}
			{value}
			{placeholder}
			{placeholderAlwaysShow}
			on:change={(e) => handleSelect(e)}
			on:clear={(e) => handleClear(e)}
		/>
	{/if}
</div>

<style>
	.themed-select-primary {
		--tw-ring-color: transparent;
		--border: 0.1em solid #641ae6;
		--border-radius: 10px;
		--background: #2a303c;
		--listBackground: #2a303c;
		--item-is-active-bg: #641ae6;
		--item-hover-bg: hsl(var(--b2));
		--height: 50px;
		--border-focused: 2px solid hsl(var(--p));
		--border-hover: 1px solid hsl(var(--pf));
		--border: 1px solid hsl(var(--p));
		--list-max-height: 200px;
		--multi-max-width: 150px;
		--multi-item-bg: hsl(var(--n));
		--multi-item-color: hsl(var(--nc));
		--multi-item-height: 2em;
		--multi-item-outline: none;
		--multi-item-padding: 0 15px;
		--multi-item-border-radius: 40px;
		--multi-item-active-outline: none;
		--list-background: hsl(var(--b3));
		--multi-item-clear-icon-color: hsl(var(--er));
	}

	:global(.multi-item-clear svg) {
		cursor: pointer;
	}
</style>
