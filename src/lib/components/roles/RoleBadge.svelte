<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Role } from '$lib/types/role';
	import Icon from 'components/general/Icon.svelte';
	import { TypeStyle } from '$lib/types/styles';

	export let role: Role;
	export let type: TypeStyle | null = TypeStyle.ghost;
	export let deleteButton = false;

	const dispatch = createEventDispatcher<{ delete: void }>();
</script>

<div class="tooltip tooltip-info" data-testid="RoleBadge" data-tip={role.description}>
	<div class={`badge badge-${type} p-2`}>
		<span class="mr-1">
			<Icon testId="RoleIcon" icon={role.icon} />
		</span>
		{role.name}
		{#if deleteButton}
			<button
				class="ml-1 text-error"
				data-testid="DeleteIcon"
				on:click={() => {
					dispatch('delete');
				}}
			>
				<Icon size="xs" icon="faXmark" />
			</button>
		{/if}
	</div>
</div>

<style>
</style>
