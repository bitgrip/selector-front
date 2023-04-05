<script lang="ts">
	import Fa from 'svelte-fa';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import PersonCard from 'components/people/personCard.svelte';
	import PersonForm from 'components/forms/personForm.svelte';
	import ConfirmDeleteAction from 'components/general/DangerZoneConfirmDeleteAction.svelte';
	import Load from 'components/general/Load.svelte';
	import Modal from 'components/general/Modal.svelte';
	import { LocalApiItems } from '$lib/apiClient/items';
	import { LocalApiPeople } from '$lib/apiClient/people';
	import { LocalApiGroups } from '$lib/apiClient/groups';
	import type { Person } from '$lib/types/person';
	import type { Item } from '$lib/types/item';
	import type { Group } from '$lib/types/group';

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
	};

	const handleCreateNewPerson = async (event: CustomEvent<Person>) => {
		await LocalApiPeople.createPerson(event.detail);
		fetchAllPeople();
		letShowCreateModal = false;
	};

	const handleDeletePerson = async (personId: string) => {
		await LocalApiPeople.deletePerson(personId);
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

{#if showDeleteModal}
	<Modal>
		<ConfirmDeleteAction
			subject="Person"
			expectedConfirmationText={personToBeDeleted.name}
			on:cancel={() => {
				showDeleteModal = false;
			}}
			on:ok={() => {
				handleDeletePerson(personToBeDeleted._id);
			}}
		>
			<svelte:fragment slot="title">Confirmation</svelte:fragment>
			<span slot="content"
				>Do you really want to delete {personToBeDeleted.name}? You can not reverse this action.
			</span>
		</ConfirmDeleteAction>
	</Modal>
{/if}

<svelte:head>
	<title>People | Selector</title>
	<meta name="description" content="Overview of all available roles" />
</svelte:head>

<div class="header prose">
	<h1>People</h1>

	<button
		class="btn btn-accent"
		on:click={() => {
			letShowCreateModal = true;
		}}><Fa size="lg" class="add-new-person-icon" icon={faPlus} /> Add person</button
	>
</div>
{#if isLoading}
	<Load />
{:else}
	<div class="flex flex-wrap gap-9 ">
		{#each people as person}
			<div>
				<PersonCard
					{person}
					on:onDelete={triggeredDeletePerson}
					on:onEdit={(event) => {
						letShowEditModal = true;
						personToBeEdited = event.detail;
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

{#if letShowCreateModal}
	<Modal>
		<PersonForm
			title={'create new person'}
			{allItems}
			{allGroupes}
			on:submit={handleCreateNewPerson}
			on:close={() => {
				letShowCreateModal = false;
			}}
		/>
	</Modal>
{/if}

{#if letShowEditModal}
	<Modal>
		<PersonForm
			title={'edit person'}
			person={personToBeEdited}
			{allItems}
			{allGroupes}
			on:submit={handleEditPerson}
			on:close={() => {
				letShowEditModal = false;
			}}
		/>
	</Modal>
{/if}

<style>
	.header {
		margin-top: 5em;
		margin-bottom: 2em;
	}
</style>
