<script lang="ts">
	import { getOcdAgent } from '$lib/apiClient/ocd';
	import Load from 'components/general/Load.svelte';
	import { onMount } from 'svelte';
	import type { OpsGenieResponse } from './types';

	let opsGenieResponse: OpsGenieResponse;
	let isLoading = true;

	onMount(async () => {
		opsGenieResponse = await getOcdAgent();
		isLoading = false;
	});
</script>

{#if isLoading}
	<Load />
{:else}
	<div class="mt-10 prose">
		<h1>
			Current Call-On-Duty Agent ist <span class="text-primary"
				>{opsGenieResponse?.data?.onCallParticipants[0]?.name}</span
			>
		</h1>
		<h4>(workdays 9:00-17:00)</h4>
	</div>
{/if}
