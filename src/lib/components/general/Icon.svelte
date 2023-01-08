<script lang="ts">
	import * as Icons from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let icon = '';
	export let size = 's';
	export let testId = 'icon';
	export let cssClass = '';
</script>

<!-- TODO fix this typing problem somehow -->
<span class={cssClass} id="icon-wrapper">
	<Fa {size} id={testId} icon={Icons[icon]} />
</span>

<style>
	/* #icon-wrapper:hover {
		filter: brightness(0.85);
	} */
</style>
