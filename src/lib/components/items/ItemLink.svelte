<script lang="ts">
	import type { Item } from '$lib/types/item';

	export let item: Item;
	export let type = 'primary';
</script>

{#if item._id && item.name}
	<a class={`link link-${type}`} href={`/items/${item._id}`}>{item.name}</a>
{/if}

<style>
</style>
