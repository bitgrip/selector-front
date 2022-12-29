<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Item } from '$lib/types/item';
	import Card from 'components/general/Card.svelte';
	import RoleBadge from 'components/roles/RoleBadge.svelte';
	import Link from 'components/general/Link.svelte';
	import { ColorStyle } from '$lib/types/styles';

	export let item: Item;

	const dispatch = createEventDispatcher<{ delete: Item; edit: Item }>();
</script>

<Card
	width={400}
	testId="ItemCard"
	on:deleteTrigger={() => {
		dispatch('delete', {
			...item
		});
	}}
	on:settingsTrigger={() => {
		dispatch('edit', {
			...item
		});
	}}
>
	<a slot="title" href={`items/${item._id}`}>{item.name}</a>

	<div slot="content" class="prose flex flex-col">
		<p data-testid="ItemDescription">{item.description}</p>

		<span class="font-semibold mt-3">Roles </span>
		<div class="">
			{#each item.roles || [] as role}
				<RoleBadge {role} />
			{/each}
		</div>

		<!-- item can be only in one group, this is due to historical reason -->
		{#if item.groupes[0]}
			<span>
				<span class="font-semibold mt-3">Group: </span>
				<Link
					text={item.groupes[0].name}
					href={`/groups/${item.groupes[0]._id}`}
					type={ColorStyle.accent}
				/>
			</span>
		{/if}
	</div>
</Card>
