<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher<{ buttonClick: void }>();

	export let buttonIcon = 'faPlus';
	export let buttonText = 'add';

	function buttonClick() {
		dispatch('buttonClick');
	}
</script>

<div class="mt-20 mb-16 lg:w-auto lg:block w-full flex flex-col grow-0 items-center">
	<h1 class="mb-5"><slot name="title" /></h1>

	<button class="btn btn-accent lg:w-auto w-full" on:click={buttonClick}>
		<Icon size="lg" class="mr-4" icon={buttonIcon} />
		{buttonText}</button
	>
</div>
