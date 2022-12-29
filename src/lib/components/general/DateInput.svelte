<script lang="ts">
	import dayjs from 'dayjs';

	export let format = 'YYYY-MM-DD';
	export let date = new Date();

	let internal: string;

	const input = (x: Date) => (internal = dayjs(x).format(format));
	const output = (x: string) => (date = dayjs(x, format).toDate());

	$: input(date);
	$: output(internal);
</script>

<input
	type="date"
	class="input input-bordered input-primary w-full focus:ring-0 focus:ring-offset-0"
	bind:value={internal}
/>
