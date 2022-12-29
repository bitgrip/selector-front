<script lang="ts">
	import { onMount } from 'svelte';
	import Load from 'components/general/Load.svelte';
	import Error from 'components/general/Error.svelte';
	import type { GroupWithItemDetails } from '$lib/types/group';
	import GroupDetail from 'components/groups/GroupDetail.svelte';

	export let data: GroupWithItemDetails;
	let isLoading = true;

	let invalidGroup = false;

	onMount(async () => {
		if (data?.group?._id) {
			isLoading = false;
		} else {
			invalidGroup = true;
			isLoading = false;
		}
	});
</script>

{#if isLoading}
	<Load />
{:else if invalidGroup}
	<Error
		>Uh no. This Group doesnt exist.
		<a class="link" href="/groups">Check all groups here.</a>
	</Error>
{:else}
	<GroupDetail groupWithItems={data} />
{/if}
