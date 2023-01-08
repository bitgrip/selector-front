<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from 'components/general/Card.svelte';
	import type { Role } from '$lib/types/role';
	import Icon from 'components/general/Icon.svelte';
	import RoleParticipantNumber from './RoleParticipantNumber.svelte';

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

		<RoleParticipantNumber canHaveMultipleParticipants={role.canHaveMultipleParticipants} />

		<!-- {#if role.canHaveMultipleParticipants}
			<div class="tooltip tooltip-info" data-tip="Multiple persons can take this role in one event">
				<div class="flex">
					<Icon icon={'faMale'} />
					<Icon icon={'faMale'} />
					<Icon icon={'faMale'} />
				</div>
			</div>
		{:else}
			<div class="tooltip tooltip-info" data-tip="Only one persons can take this role in one event">
				<div class="flex">
					<Icon icon={'faMale'} />
				</div>
			</div>
		{/if} -->
	</div>
</Card>

<style>
</style>
