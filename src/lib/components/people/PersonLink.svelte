<script lang="ts">
	import type { Person } from '$lib/types/person';
	import { ColorStyle } from '$lib/types/styles';

	export let person: Person;
	export let type: ColorStyle | null = ColorStyle.primary;
</script>

<a class={`link link-${type}`} href={`/people/${person._id}`}>{person.name}</a>

<style>
</style>
