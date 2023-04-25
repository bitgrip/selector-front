<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let inputLabel: string;
	export let inputPlaceholder: string = 'Type here';
	export let textValue: string;

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

<label class="label" for={`${inputLabel}-ID`}>
	<span class="label-text">{inputLabel}{isRequired ? '*' : ''}</span>
</label>
<input
	bind:value={textValue}
	on:input={checkInput}
	on:change={checkInput}
	on:blur={checkInput}
	type="text"
	id={`${inputLabel}-ID`}
	placeholder={inputPlaceholder}
	class={`input input-bordered w-full focus:ring-0 focus:ring-offset-0 
	placeholder-opacity-75 placeholder-gray-500 ${classesFromTheParent} ${
		isMissingValue ? 'input-error' : ''
	}`}
/>

<style>
	input:focus {
		border: none;
	}
</style>
