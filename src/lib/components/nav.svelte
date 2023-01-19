<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { env } from '$env/dynamic/public';

	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	let showOcd = env.PUBLIC_OCD_SHOW === 'true';
</script>

<header class="header-area">
	<div class="navbar fixed top-0 left-0 right-0 z-50 bg-neutral-focus shadow-lg border-none">
		<div class="navbar-start">
			<div class="dropdown">
				<button tabindex="0" class="btn btn-ghost btn-circle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h7"
						/></svg
					>
				</button>
				<ul
					class="menu menu-compact dropdown-content mt-5 p-2 shadow-lg bg-neutral-focus rounded-box w-52"
				>
					<li><a class="btn btn-ghost normal-case text-xl" href="/">Items</a></li>
					<li><a class="btn btn-ghost normal-case text-xl" href="/people">People</a></li>
					<li><a class="btn btn-ghost normal-case text-xl" href="/roles">Roles</a></li>
					<li><a class="btn btn-ghost normal-case text-xl" href="/groups">Groups</a></li>
					<li><a class="btn btn-ghost normal-case text-xl" href="/about">About</a></li>
					{#if showOcd}
						<li><a class="btn btn-ghost normal-case text-xl" href="/ocd">OnCallDuty</a></li>
					{/if}
				</ul>
			</div>
		</div>

		<div class="navbar-end">
			<select
				class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
				data-choose-theme
			>
				<option disabled value=""> Pick a theme </option>
				<option value="">default (dark)</option>
				<option value="light">light</option>
				<option value="retro">retro</option>
				<option value="dracula">dracula</option>
				<option value="cyberpunk">cyberpunk</option>
				<option value="cupcake">cupcake</option>
				<option value="bumblebee">bumblebee</option>
				<option value="emerald">emerald</option>
				<option value="corporate">corporate</option>
				<option value="synthwave">synthwave</option>
				<option value="valentine">valentine</option>
				<option value="halloween">halloween</option>
				<option value="garden">garden</option>
				<option value="forest">forest</option>
				<option value="aqua">aqua</option>
				<option value="lofi">lofi</option>
				<option value="pastel">pastel</option>
				<option value="fantasy">fantasy</option>
				<option value="wireframe">wireframe</option>
				<option value="black">black</option>
				<option value="luxury">luxury</option>
				<option value="cmyk">cmyk</option>
				<option value="autumn">autumn</option>
				<option value="business">business</option>
				<option value="acid">acid</option>
				<option value="lemonade">lemonade</option>
				<option value="night">night</option>
				<option value="coffee">coffee</option>
				<option value="winter">winter</option>
			</select>
		</div>
	</div>
</header>
