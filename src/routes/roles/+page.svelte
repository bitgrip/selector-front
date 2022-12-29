<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'components/general/Modal.svelte';
	import RoleForm from 'components/forms/roleForm.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import RoleCard from 'components/roles/RoleCard.svelte';
	import DangerZoneConfirmDeleteAction from 'components/general/DangerZoneConfirmDeleteAction.svelte';
	import Load from 'components/general/Load.svelte';
	import { LocalApiRoles } from '$lib/apiClient/roles';
	import type { Role } from '$lib/types/role';

	let roles: Array<Role> = [];

	let roleToBeDeleted: Role = {
		_id: '',
		description: '',
		name: '',
		icon: ''
	};
	let roleToBeEdited: Role = {
		_id: '',
		description: '',
		name: '',
		icon: ''
	};

	let showDeleteModal = false;
	let letShowCreateModal = false;
	let letShowEditModal = false;

	let isLoading = true;

	onMount(async () => {
		await fetchAllRoles();
		isLoading = false;
	});

	const fetchAllRoles = async () => {
		roles = await LocalApiRoles.getAllRoles();
	};

	const handleCreateNewRole = async (event: CustomEvent<Role>) => {
		await LocalApiRoles.createRole(event.detail);
		letShowCreateModal = false;
		fetchAllRoles();
	};

	const handleDeleteRole = async (roleId: Role['_id']) => {
		await LocalApiRoles.deleteRole(roleId);
		fetchAllRoles();
		showDeleteModal = false;
	};

	const handleEditRole = async (event: CustomEvent<Role>) => {
		await LocalApiRoles.updateRole(roleToBeEdited._id, event.detail);
		fetchAllRoles();
		letShowEditModal = false;
	};

	const triggeredDeleteRole = async (event: CustomEvent<Role>) => {
		roleToBeDeleted = event.detail;
		showDeleteModal = true;
	};
</script>

<div class="header prose">
	<h1>Roles</h1>

	<button
		class="btn btn-accent"
		on:click={(e) => {
			letShowCreateModal = true;
		}}><Fa size="lg" class="add-new-role-icon" icon={faPlus} /> Add Role</button
	>
</div>

{#if isLoading}
	<Load />
{:else}
	<div class="grid grid-cols-3 gap-5">
		{#each roles as role}
			<div>
				<RoleCard
					{role}
					on:delete={triggeredDeleteRole}
					on:edit={(event) => {
						letShowEditModal = true;
						roleToBeEdited = event.detail;
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

{#if letShowCreateModal}
	<Modal>
		<RoleForm
			title={'create new role'}
			on:submit={handleCreateNewRole}
			on:close={() => {
				letShowCreateModal = false;
			}}
		/>
	</Modal>
{/if}

{#if letShowEditModal}
	<Modal>
		<RoleForm
			title={'create new role'}
			role={roleToBeEdited}
			on:submit={handleEditRole}
			on:close={() => {
				letShowEditModal = false;
			}}
		/>
	</Modal>
{/if}

{#if showDeleteModal}
	<Modal>
		<DangerZoneConfirmDeleteAction
			subject="role"
			expectedConfirmationText={roleToBeDeleted.name}
			on:cancel={() => {
				showDeleteModal = false;
			}}
			on:ok={() => {
				handleDeleteRole(roleToBeDeleted._id);
			}}
		>
			<svelte:fragment slot="title">Confirmation</svelte:fragment>
			<span slot="content"
				>Do you really want to delete {roleToBeDeleted.name}? You can not reverse this action.
			</span>
		</DangerZoneConfirmDeleteAction>
	</Modal>
{/if}

<style>
	.header {
		margin-top: 5em;
		margin-bottom: 2em;
	}
</style>
