<script lang="ts">
	import ItemCard from './itemCard.svelte';
	import { onMount } from 'svelte';
	import Modal from 'components/general/Modal.svelte';
	import ItemForm from 'components/forms/ItemForm.svelte';
	import DangerZoneConfirmDeleteAction from 'components/general/DangerZoneConfirmDeleteAction.svelte';
	import { handleCreateNewItem, handleDeleteItem, handleEditItem } from './itemHandlerFunctions';
	import Load from 'components/general/Load.svelte';
	import { LocalApiItems } from '$lib/apiClient/items';
	import { LocalApiGroups } from '$lib/apiClient/groups';
	import { LocalApiRoles } from '$lib/apiClient/roles';
	import type { Item } from '$lib/types/item';
	import type { Group } from '$lib/types/group';
	import type { Role } from '$lib/types/role';
	import Icon from 'components/general/Icon.svelte';
	import Alert from 'components/general/Alert.svelte';
	import type { AlertInfo } from '$lib/types/alert';

	let items: Array<Item> = [];
	let allRoles: Array<Role> = [];
	let allGroupes: Array<Group> = [];
	let workingItemReference: Item = {
		_id: '',
		description: '',
		groupes: [],
		isLongerThenOneDay: false,
		name: '',
		roles: []
	};
	let isLoading = true;
	let showAlert = false;

	let alertInfo: AlertInfo = {
		text: 'sample text',
		timer: 4000,
		type: 'success'
	};

	onMount(async () => {
		await fetchEverything();
		isLoading = false;
	});

	const fetchEverything = async () => {
		items = await LocalApiItems.getAllItems();
		allRoles = await LocalApiRoles.getAllRoles();
		allGroupes = await LocalApiGroups.getAllGroups();
	};

	let showCreateItemModal = false;
	let showDeleteItemModal = false;
	let showEditItemModal = false;
</script>

<svelte:head>
	<title>Tracked Items</title>
</svelte:head>

<div class="top prose">
	<h1>Tracked items</h1>
	<button
		class="btn btn-accent"
		on:click={() => {
			showCreateItemModal = true;
		}}
	>
		<Icon size="lg" cssClass="add-new-tracking-icon" icon="faPlus" />
		Add new tracking
	</button>
</div>
{#if isLoading}
	<Load />
{:else}
	<div class="flex flex-wrap gap-9 ">
		{#each items as item}
			<div>
				<ItemCard
					{item}
					on:delete={(event) => {
						workingItemReference = event.detail;
						showDeleteItemModal = true;
					}}
					on:edit={(event) => {
						showEditItemModal = true;
						workingItemReference = event.detail;
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

{#if showCreateItemModal}
	<Modal>
		<ItemForm
			{allRoles}
			{allGroupes}
			on:submit={(event) => {
				handleCreateNewItem(event).then(() => {
					showCreateItemModal = false;
					fetchEverything();
				});
			}}
			on:close={() => {
				showCreateItemModal = false;
			}}
		>
			<h1 slot="title">create new item</h1>
		</ItemForm>
	</Modal>
{/if}

{#if showDeleteItemModal}
	<Modal>
		<DangerZoneConfirmDeleteAction
			subject="item"
			expectedConfirmationText={workingItemReference.name}
			on:cancel={() => {
				showDeleteItemModal = false;
			}}
			on:ok={() => {
				handleDeleteItem(workingItemReference._id)
					.then(() => {
						showDeleteItemModal = false;
						alertInfo.text = 'Item deleted.';
						alertInfo.type = 'success';
						showAlert = true;
						fetchEverything();
					})
					.catch((e) => {
						showDeleteItemModal = false;
						alertInfo.text = `Error when deleting item: <${e}>`;
						alertInfo.type = 'error';
						showAlert = true;
					});
			}}
		>
			<svelte:fragment slot="title">Confirmation</svelte:fragment>
			<span slot="content"
				>Do you really want to delete {workingItemReference.name}? You can not reverse this action.
			</span>
		</DangerZoneConfirmDeleteAction>
	</Modal>
{/if}

{#if showEditItemModal}
	<Modal>
		<ItemForm
			item={workingItemReference}
			{allRoles}
			{allGroupes}
			on:submit={(event) => {
				handleEditItem(event, workingItemReference._id).then(() => {
					showEditItemModal = false;
					fetchEverything();
				});
			}}
			on:close={() => {
				showEditItemModal = false;
			}}
		>
			<h1 slot="title">
				edit <span class="text-primary">{workingItemReference.name}</span>'s details
			</h1>
		</ItemForm>
	</Modal>
{/if}

{#if showAlert}
	<Alert
		{alertInfo}
		on:timeout={() => {
			showAlert = false;
		}}
		on:click={() => {
			showAlert = false;
		}}
	/>
{/if}

<style>
	button {
		margin: 2em;
		margin-left: 0em;
	}

	.top {
		margin-top: 5em;
	}
	h1 {
		margin-bottom: 0;
	}

	:global(.add-new-tracking-icon) {
		margin-right: 1em;
	}
</style>
