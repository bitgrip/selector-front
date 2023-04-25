<script lang="ts">
	import Icon from 'components/general/Icon.svelte';

	export let canHaveMultipleParticipants: boolean;
</script>

<div>
	{#if canHaveMultipleParticipants}
		<div class="tooltip tooltip-info mr-4" data-tip="Multiple persons can take this role in one event">
			<div class="flex">
				<Icon icon={'faMale'} />
				<Icon icon={'faMale'} />
				<Icon icon={'faMale'} />
			</div>
		</div>
	{:else}
		<div class="tooltip tooltip-info mr-4" data-tip="Only one persons can take this role in one event">
			<div class="flex">
				<Icon icon={'faMale'} />
			</div>
		</div>
	{/if}
</div>
