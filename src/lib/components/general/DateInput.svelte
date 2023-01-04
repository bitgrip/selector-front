<script lang="ts">
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';

	export let format = 'YYYY-MM-DD';
	export let date: Date | string = new Date();
	export let isRequired = false;
	export let inputLabel: string;

	const dispatch = createEventDispatcher<{ onUserInteraction: void }>();

	let isMissingValue = false;
	let internal: string;

	const input = (x: Date | string) => (internal = dayjs(x).format(format));
	const output = (x: string) => (date = dayjs(x, format).toDate());

	$: input(date);
	$: output(internal);

	$: classesFromTheParent = $$props.class;

	const checkInput = () => {
		if (isRequired) {
			if (internal) {
				isMissingValue = false;
			} else {
				isMissingValue = true;
			}

			dispatch('onUserInteraction');
		}
	};
</script>

<label class="label" for={`${inputLabel}-ID`}>
	<span class="label-text">{inputLabel}{isRequired ? '*' : ''}</span>
</label>
<input
	type="date"
	id={`${inputLabel}-ID`}
	class={`input input-bordered input-primary w-full focus:ring-0 focus:ring-offset-0 ${classesFromTheParent}`}
	bind:value={internal}
	on:input={checkInput}
	on:change={checkInput}
	on:blur={checkInput}
/>
