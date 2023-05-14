<script lang="ts">
	import Icon from 'components/general/Icon.svelte';

	export let inputLabel: string;
	export let inputLabelHelp: string = '';
	export let value: boolean;

	$: classesFromTheParent = $$props.class;
</script>

<label class="flex items-center pt-2 pb-2 " for={`${inputLabel}-ID`}>
	<span class="label-text">{inputLabel}</span>
	{#if inputLabelHelp}
		<span class="ml-2 z-40 tooltip tooltip-info" data-tip={inputLabelHelp}
			><Icon icon={'faCircleInfo'} /></span
		>
	{/if}
</label>
<input
	bind:checked={value}
	type="checkbox"
	id={`${inputLabel}-ID`}
	class={`toggle ${classesFromTheParent}`}
/>
