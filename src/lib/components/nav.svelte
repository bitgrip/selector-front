<script lang="ts">
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { env } from '$env/dynamic/public';

	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	let navLinks = [
		{
			label: 'Items',
			href: '/',
			showCondition: null,
			id: 'page-items'
		},
		{
			label: 'People',
			href: '/people',
			showCondition: null,
			id: 'page-people'
		},
		{
			label: 'Roles',
			href: '/roles',
			showCondition: null,
			id: 'page-roles'
		},
		{
			label: 'Groups',
			href: '/groups',
			showCondition: null,
			id: 'page-groups'
		},
		{
			label: 'About',
			href: '/about',
			showCondition: null,
			id: 'page-about'
		},
		{
			label: 'OCD',
			href: '/ocd',
			showCondition: () => env.PUBLIC_OCD_SHOW === 'true',
			id: 'page-ocd'
		}
	];

	let activePage = 'page-items';

	const activatePage = (page: string) => {
		activePage = page;
		showMenu = false;
	};

	let showMenu = false;
</script>

<header>
	<nav
		class={`
		${!showMenu && 'flex'}
		 fixed 
		 top-0 
		 left-0 
		 right-0 
		 z-50 
		 bg-neutral-focus 
		 shadow-lg 
		 border-none
		 justify-between
		 w-full
		 p-2
		 pl-3
		 xl:pl-36
		 pr-6
		`}
	>
		<svg
			on:click={() => {
				showMenu = !showMenu;
			}}
			on:keydown={() => {
				showMenu = !showMenu;
			}}
			xmlns="http://www.w3.org/2000/svg"
			id="menu-button"
			class="h-6 w-6 cursor-pointer md:hidden block mt-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="hsl(var(--a))"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>

		<div class={`${!showMenu && 'hidden'} md:flex md:items-center md:w-auto`} id="menu">
			<ul
				class="
			 pb-4
			 text-base text-gray-700
			 flex-column
			 flex
			 flex-wrap
			 md:flex-nowrap
			 md:flex
			 md:flex-column
			 md:justify-between 
			 md:pt-0
			 md:pb-0
			 "
			>
				{#each navLinks as link}
					{#if (link.showCondition !== null && link.showCondition()) || link.showCondition === null}
						<li
							on:click={() => activatePage(link.id)}
							on:keydown={() => activatePage(link.id)}
							class={`mr-2 md:w-auto w-full ${
								showMenu ? 'flex items-center justify-center p-3' : ''
							}`}
						>
							<a
								class={`btn btn-ghost normal-case text-xl ${showMenu ? 'text-2xl' : ''} ${
									activePage === link.id ? 'text-accent' : 'text-base-content'
								}`}
								href={link.href}>{link.label}</a
							>
						</li>
					{/if}
				{/each}
			</ul>
		</div>

		<div class={`${showMenu && 'hidden'} mt-1  `}>
			<select
				class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-auto"
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
	</nav>
</header>
