<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import { faGear } from '@fortawesome/free-solid-svg-icons';

	export let width = 300;
	export let backgroundColor = 'bg-neutral';
	export let titleTextColor = 'accent';
	export let testId = 'Card';

	const dispatch = createEventDispatcher<{ deleteTrigger: void; settingsTrigger: void }>();

	function deleteTrigger() {
		dispatch('deleteTrigger');
	}

	function settingsTrigger() {
		dispatch('settingsTrigger');
	}
</script>

<div
	class="card w-96 {backgroundColor} shadow-xl overflow-visible p-2 h-fit"
	style="width: {width}px"
	data-testid={testId}
>
	<div class="card-body">
		<div class="card-header flex justify-between align-center">
			{#if $$slots.title}
				<!-- <h2 class="text-{titleTextColor} hover:text-{titleTextColor}-focus card-title"> -->
				<slot name="title" />
				<!-- </h2> -->
			{/if}

			<div class="card-actions justify-end">
				<button on:click={settingsTrigger}><Fa size="lg" id="setting" icon={faGear} /></button>
				<button on:click={deleteTrigger}><Fa size="lg" id="delete" icon={faTrash} /></button>
			</div>
		</div>
		<slot name="content" />
	</div>
</div>

<style>
	:global(svg) {
		transition: color 0.4s ease-out 100ms;
	}

	:global(#delete:hover) {
		color: hsl(var(--er));
	}

	:global(#setting:hover) {
		color: hsl(var(--in));
	}
</style>
