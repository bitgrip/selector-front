<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Person } from '$lib/types/person';
	import Card from 'components/general/Card.svelte';

	const dispatch = createEventDispatcher<{ onDelete: Person; onEdit: Person }>();

	export let person: Person;
</script>

<Card
	width={250}
	backgroundColor={person.active ? 'bg-neutral' : 'bg-neutral-focus'}
	titleTextColor={person.active ? 'accent' : 'error'}
	on:deleteTrigger={() => {
		dispatch('onDelete', {
			...person
		});
	}}
	on:settingsTrigger={() => {
		dispatch('onEdit', {
			...person
		});
	}}
>
	<a slot="title" href={`people/${person._id}`}>{person.name}</a>
</Card>
