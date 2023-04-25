<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import { faGear } from '@fortawesome/free-solid-svg-icons';

	export let testId = 'Card';

	const dispatch = createEventDispatcher<{ deleteTrigger: void; settingsTrigger: void }>();
	$: classesFromTheParent = $$props.class;

	function deleteTrigger() {
		dispatch('deleteTrigger');
	}

	function settingsTrigger() {
		dispatch('settingsTrigger');
	}
</script>

<div
	class="card bg-neutral shadow-xl overflow-visible p-2 h-fit {classesFromTheParent}"
	data-testid={testId}
>
	<div class="card-body">
		<div class="card-header flex justify-between align-center lg:max-w-lg">
			{#if $$slots.title}
				<slot name="title" />
			{/if}

			<div class="ml-4 card-actions justify-end min-w-min flex flex-nowrap">
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
