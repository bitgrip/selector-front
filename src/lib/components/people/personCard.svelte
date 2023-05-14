<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Person } from '$lib/types/person';
	import Card from 'components/general/Card.svelte';

	const dispatch = createEventDispatcher<{ onDelete: Person; onEdit: Person }>();

	export let person: Person;
</script>

<Card
	testId="PersonCard"
	class="lg:w-1/6 md:w-1/6 w-full min-w-fit {person.active ? 'bg-neutral' : 'bg-base-300'}"
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
	<h4
		slot="title"
		class="text-accent hover:text-accent-focus transform transition duration-200 mr-4 {!person.active &&
			'text-error'}"
	>
		<a href={`people/${person._id}`}>{person.name}</a>
	</h4>
</Card>
