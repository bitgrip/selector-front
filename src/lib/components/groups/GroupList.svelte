<script lang="ts">
	import { LocalApiGroups } from '$lib/apiClient/groups';
	import type { Group } from '$lib/types/group';
	import DangerZoneConfirmDeleteActionModal from 'components/general/DangerZoneConfirmDeleteActionModal.svelte';
	import Load from 'components/general/Load.svelte';
	import PageHeader from 'components/general/PageHeader.svelte';
	import GroupCard from 'components/groups/GroupCard.svelte';
	import { onMount } from 'svelte';
	import GroupFormModal from './forms/GroupFormModal.svelte';

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
		isLoading = false;
	};

	const handleDeleteGroup = async (groupId: Group['_id']) => {
		const res = await LocalApiGroups.deleteGroup(groupId);
		isLoading = true;
		fetchAllGroups();
		showDeleteModal = false;
	};

	const handleCreateNewGroup = async (event: CustomEvent<Group>) => {
		console.log(event);
		const res = await LocalApiGroups.createGroup({
			name: event.detail.name,
			description: event.detail.description
		});
		letShowCreateModal = false;
		fetchAllGroups();
	};

	const handleEditGroup = async (event: CustomEvent<Group>) => {
		console.log(event);
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

<svelte:head>
	{#if letShowEditModal || letShowCreateModal || showDeleteModal}
		<style>
			body {
				overflow-y: hidden;
			}
		</style>
	{/if}
</svelte:head>

<PageHeader buttonText="Add new group" on:buttonClick={() => (letShowCreateModal = true)}>
	<svelte:fragment slot="title">Groups</svelte:fragment>
</PageHeader>

{#if isLoading}
	<Load />
{:else}
	<div class="flex flex-wrap gap-9 ">
		{#each groups as group}
			<GroupCard
				{group}
				on:delete={triggeredDeleteGroup}
				on:edit={(event) => {
					letShowEditModal = true;
					groupToBeEdited = event.detail;
				}}
			/>
		{/each}
	</div>
{/if}

{#if letShowCreateModal}
	<GroupFormModal
		class="lg:w-fit w-full"
		on:submit={handleCreateNewGroup}
		on:close={() => {
			letShowCreateModal = false;
		}}
	>
		<h1 slot="title">Create new group</h1>
	</GroupFormModal>
{/if}

{#if letShowEditModal}
	<GroupFormModal
		group={groupToBeEdited}
		class="lg:w-fit w-full"
		on:submit={handleEditGroup}
		on:close={() => {
			letShowEditModal = false;
		}}
	>
		<h1 slot="title">
			Edit <span class="text-primary">{groupToBeEdited.name}</span>'s details
		</h1>
	</GroupFormModal>
{/if}

{#if showDeleteModal}
	<DangerZoneConfirmDeleteActionModal
		class="lg:w-1/2"
		subject="Group"
		expectedConfirmationText={groupToBeDeleted.name}
		on:cancel={() => {
			showDeleteModal = false;
		}}
		on:ok={() => {
			handleDeleteGroup(groupToBeDeleted._id);
		}}
	>
		<h1 slot="title">Delete confirmation</h1>
		<span slot="confirmation-content"
			>Do you really want to delete {groupToBeDeleted.name}? You can not reverse this action.
		</span>
	</DangerZoneConfirmDeleteActionModal>
{/if}
