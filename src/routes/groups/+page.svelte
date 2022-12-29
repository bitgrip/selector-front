<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'components/general/Modal.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import GroupCard from 'components/groups/GroupCard.svelte';
	import GroupForm from 'components/forms/groupForm.svelte';
	import DangerZoneConfirmDeleteAction from 'components/general/DangerZoneConfirmDeleteAction.svelte';
	import Load from 'components/general/Load.svelte';
	import { LocalApiGroups } from '$lib/apiClient/groups';
	import type { Group } from '$lib/types/group';

	let groups: Array<Group> = [];
	let isLoading = true;

	let groupToBeDeleted: Group = {
		_id: '',
		name: '',
		description: '',
		items: []
	};
	let groupToBeEdited: Group = {
		_id: '',
		name: '',
		description: '',
		items: []
	};

	onMount(async () => {
		await fetchAllGroups();
		isLoading = false;
	});

	const fetchAllGroups = async () => {
		const res = await LocalApiGroups.getAllGroups();
		groups = res;
	};

	const handleDeleteGroup = async (groupId: Group['_id']) => {
		const res = await LocalApiGroups.deleteGroup(groupId);
		fetchAllGroups();
		showDeleteModal = false;
	};

	const handleCreateNewGroup = async (event: CustomEvent<Group>) => {
		const res = await LocalApiGroups.createGroup({
			name: event.detail.name,
			description: event.detail.description
		});
		letShowCreateModal = false;
		fetchAllGroups();
	};

	const handleEditGroup = async (event: CustomEvent<Group>) => {
		const res = await LocalApiGroups.updateGroup(groupToBeEdited._id, event.detail);
		fetchAllGroups();
		letShowEditModal = false;
	};

	const triggeredDeleteGroup = async (event: CustomEvent<Group>) => {
		groupToBeDeleted = event.detail;
		showDeleteModal = true;
	};

	let showDeleteModal = false;
	let letShowCreateModal = false;
	let letShowEditModal = false;
</script>

<div class="header prose">
	<h1>Groups</h1>

	<button
		class="btn btn-accent"
		on:click={(e) => {
			letShowCreateModal = true;
		}}><Fa size="lg" class="add-new-role-icon" icon={faPlus} /> Add Group</button
	>
</div>

{#if isLoading}
	<Load />
{:else}
	<div class="flex flex-wrap gap-9 ">
		{#each groups as group}
			<div>
				<GroupCard
					{group}
					on:delete={triggeredDeleteGroup}
					on:edit={(event) => {
						letShowEditModal = true;
						groupToBeEdited = event.detail;
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

{#if letShowCreateModal}
	<Modal>
		<GroupForm
			title={'create new role'}
			on:submit={handleCreateNewGroup}
			on:close={() => {
				letShowCreateModal = false;
			}}
		/>
	</Modal>
{/if}

{#if letShowEditModal}
	<Modal>
		<GroupForm
			title={'create new role'}
			group={groupToBeEdited}
			on:submit={handleEditGroup}
			on:close={() => {
				letShowEditModal = false;
			}}
		/>
	</Modal>
{/if}

{#if showDeleteModal}
	<Modal>
		<DangerZoneConfirmDeleteAction
			subject="group"
			expectedConfirmationText={groupToBeDeleted.name}
			on:cancel={() => {
				showDeleteModal = false;
			}}
			on:ok={() => {
				handleDeleteGroup(groupToBeDeleted._id);
			}}
		>
			<svelte:fragment slot="title">Confirmation</svelte:fragment>
			<span slot="content"
				>Do you really want to delete {groupToBeDeleted.name}? You can not reverse this action.
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
