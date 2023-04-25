<script lang="ts">
	import { LocalApiGroups } from '$lib/apiClient/groups';
	import { LocalApiItems } from '$lib/apiClient/items';
	import { LocalApiPeople } from '$lib/apiClient/people';
	import type { Group } from '$lib/types/group';
	import type { Item } from '$lib/types/item';
	import type { Person } from '$lib/types/person';
	import DangerZoneConfirmDeleteActionModal from 'components/general/DangerZoneConfirmDeleteActionModal.svelte';
	import Load from 'components/general/Load.svelte';
	import PageHeader from 'components/general/PageHeader.svelte';
	import PersonCard from 'components/people/personCard.svelte';
	import { onMount } from 'svelte';
	import PersonFormModal from './forms/PersonFormModal.svelte';

	let people: Array<Person> = [];
	let allItems: Array<Item> = [];
	let allGroupes: Array<Group> = [];

	let showDeleteModal = false;
	let letShowCreateModal = false;
	let letShowEditModal = false;

	let isLoading = true;

	let personToBeEdited: Person = {
		_id: '',
		active: false,
		name: ''
	};
	let personToBeDeleted: Person = {
		_id: '',
		active: false,
		name: ''
	};

	onMount(async () => {
		await fetchAllPeople();
		allItems = await LocalApiItems.getAllItems();
		allGroupes = await LocalApiGroups.getAllGroups();
		isLoading = false;
	});

	const fetchAllPeople = async () => {
		people = await LocalApiPeople.getAllPeople();
		isLoading = false;
	};

	const handleCreateNewPerson = async (event: CustomEvent<Person>) => {
		await LocalApiPeople.createPerson(event.detail);
		fetchAllPeople();
		letShowCreateModal = false;
	};

	const handleDeletePerson = async (personId: string) => {
		await LocalApiPeople.deletePerson(personId);
		isLoading = true;
		fetchAllPeople();
		showDeleteModal = false;
	};

	const handleEditPerson = async (event: CustomEvent<Person>) => {
		await LocalApiPeople.updatePerson(personToBeEdited._id, event.detail);
		fetchAllPeople();
		letShowEditModal = false;
	};

	const triggeredDeletePerson = (event: CustomEvent<Person>) => {
		personToBeDeleted = event.detail;
		showDeleteModal = true;
	};
</script>

<svelte:head>
	{#if letShowCreateModal || letShowEditModal || showDeleteModal}
		<style>
			body {
				overflow-y: hidden;
			}
		</style>
	{/if}
</svelte:head>

<PageHeader buttonText="Add new person" on:buttonClick={() => (letShowCreateModal = true)}>
	<svelte:fragment slot="title">People</svelte:fragment>
</PageHeader>

{#if isLoading}
	<Load />
{:else}
	<div class="flex flex-wrap gap-9 ">
		{#each people as person}
			<PersonCard
				{person}
				on:onDelete={triggeredDeletePerson}
				on:onEdit={(event) => {
					letShowEditModal = true;
					personToBeEdited = event.detail;
				}}
			/>
		{/each}
	</div>
{/if}

{#if showDeleteModal}
	<DangerZoneConfirmDeleteActionModal
		class="lg:w-1/2"
		subject="Person"
		expectedConfirmationText={personToBeDeleted.name}
		on:cancel={() => {
			showDeleteModal = false;
		}}
		on:ok={() => {
			handleDeletePerson(personToBeDeleted._id);
		}}
	>
		<h1 slot="title">Delete confirmation</h1>
		<span slot="confirmation-content"
			>Do you really want to delete {personToBeDeleted.name}? You can not reverse this action.
		</span>
	</DangerZoneConfirmDeleteActionModal>
{/if}

{#if letShowCreateModal}
	<PersonFormModal
		{allGroupes}
		{allItems}
		class="lg:w-fit w-full"
		on:submit={(event) => {
			handleCreateNewPerson(event).then(() => {
				letShowCreateModal = false;
				fetchAllPeople();
			});
		}}
		on:close={() => {
			letShowCreateModal = false;
		}}
	>
		<h1 slot="title">Create new person</h1>
	</PersonFormModal>
{/if}

{#if letShowEditModal}
	<PersonFormModal
		{allGroupes}
		{allItems}
		person={personToBeEdited}
		class="lg:w-2/3 w-full"
		on:submit={(event) => {
			handleEditPerson(event).then(() => {
				letShowCreateModal = false;
				fetchAllPeople();
			});
		}}
		on:close={() => {
			letShowEditModal = false;
		}}
	>
		<h1 slot="title">
			Edit <span class="text-primary">{personToBeEdited.name}</span>'s details
		</h1>
	</PersonFormModal>
{/if}
