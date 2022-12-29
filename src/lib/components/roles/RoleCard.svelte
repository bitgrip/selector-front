<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from 'components/general/Card.svelte';
	import type { Role } from '$lib/types/role';
	import Icon from 'components/general/Icon.svelte';

	export let role: Role;

	const dispatch = createEventDispatcher<{ delete: Role; edit: Role }>();
</script>

<Card
	width={400}
	on:deleteTrigger={() => {
		dispatch('delete', {
			...role
		});
	}}
	on:settingsTrigger={() => {
		dispatch('edit', {
			...role
		});
	}}
>
	<svelte:fragment slot="title">
		<Icon size="lg" icon={role.icon} />
		<span>{role.name}</span></svelte:fragment
	>

	<div slot="content">
		<div>{role.description}</div>
		<div>{role.icon}</div>
	</div>
</Card>

<style>
</style>
