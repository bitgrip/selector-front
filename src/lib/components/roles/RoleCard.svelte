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
	testId="RoleCard"
	class="lg:w-3/12 w-full"
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
	<div slot="title" class="flex flex-row text-accent items-center ">
		<Icon size="lg" icon={role.icon} />
		<h4 class="ml-2">{role.name}</h4>
	</div>

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
