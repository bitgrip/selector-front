<script lang="ts">
	import Icon from 'components/general/Icon.svelte';
	import { createEventDispatcher } from 'svelte';

	export let inputLabel: string;
	export let inputLabelHelp: string = '';
	export let inputPlaceholder: string = 'Type here';
	export let textValue: string = '';

	export let isRequired = false;
	export let isMissingValue = false;

	const dispatch = createEventDispatcher<{ onUserInteraction: void }>();

	const checkInput = () => {
		if (isRequired) {
			if (textValue) {
				isMissingValue = false;
			} else {
				isMissingValue = true;
			}

			dispatch('onUserInteraction');
		}
	};

	$: classesFromTheParent = $$props.class;
</script>

<label class="flex items-center pt-2 pb-2" for={`${inputLabel}-ID`}>
	<span class="label-text">{inputLabel}{isRequired ? '*' : ''}</span>
	{#if inputLabelHelp}
		<span class="ml-2 z-40 tooltip tooltip-info" data-tip={inputLabelHelp}
			><Icon icon={'faCircleInfo'} /></span
		>
	{/if}
</label>

<textarea
	class={`textarea w-full focus:ring-0 focus:ring-offset-0 
	focus:border-none placeholder-opacity-75 placeholder-gray-500 ${classesFromTheParent} ${
		isMissingValue ? 'textarea-error' : ''
	}`}
	placeholder={inputPlaceholder}
	id={`${inputLabel}-ID`}
	bind:value={textValue}
	on:input={checkInput}
	on:change={checkInput}
	on:blur={checkInput}
/>

<style>
</style>
