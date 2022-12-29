<script lang="ts">
	export let inputLabel: string;
	export let inputPlaceholder: string = "Type here";
	export let textValue: string;

	const classesFromTheParent = $$props.class;
</script>

<label class="label" for={`${inputLabel}-ID`}>
	<span class="label-text">{inputLabel}</span>
</label>
<input
	bind:value={textValue}
	type="text"
	id={`${inputLabel}-ID`}
	placeholder={inputPlaceholder}
	class={`input input-bordered w-full max-w-xs focus:ring-0 focus:ring-offset-0 ${classesFromTheParent}`}
/>

<style>
	input:focus {
		border: none;
	}
</style>
