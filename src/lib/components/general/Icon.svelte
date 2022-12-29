<script lang="ts">
	import * as Icons from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let icon = '';
	export let size = 's';
	export let testId = 'icon';
	export let cssClass = '';
</script>

<!-- TODO fix this typing problem somehow -->
<Fa {size} id={testId} class={cssClass} icon={Icons[icon]} />
