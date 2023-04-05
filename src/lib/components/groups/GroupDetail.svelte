<script lang="ts">
	import type { GroupWithItemDetails } from '$lib/types/group';
	import ItemCardDetailed from 'components/items/ItemCardDetailed.svelte';

	export let groupWithItems: GroupWithItemDetails;
	$: group = groupWithItems.group;
</script>

<svelte:head>
	<title>{`Detail of ${group.name} group`}</title>
	<meta name="description" content="Detail of ${group.name} group" />
</svelte:head>

<div class="top prose">
	<h1><span class="text-accent"> {group.name}</span>'s overview</h1>
</div>

{#each groupWithItems.allRotationItems || [] as item}
	<ItemCardDetailed {item} />
{/each}

<style>
	.top {
		margin-top: 5em;
	}
</style>
