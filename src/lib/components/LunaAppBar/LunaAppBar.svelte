<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	// Types
	import type { ModalSettings, DrawerSettings } from '@skeletonlabs/skeleton';
	// // Luna
	import LunaLogo from '$lib/components/LunaLogos/LunaLogo.svelte';
	// import DocsIcon from '$lib/components/DocsIcon/DocsIcon.svelte';

	// Components & Utilities
	import { AppBar, LightSwitch, popup, getModalStore } from '@skeletonlabs/skeleton';

	// Stores
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { storeTheme } from '$lib/stores/stores';
	const drawerStore = getDrawerStore();

	// Local
	let isOsMac = false;
	const modalStore = getModalStore();

	// Set Search Keyboard Shortcut
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}	
	function triggerSearch(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSearch',
			position: 'item-start'
		};
		modalStore.trigger(modal);
	}


	// Keyboard Shortcut (CTRL/⌘+K) to Focus Search
	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			// Prevent default browser behavior of focusing URL bar
			e.preventDefault();
			// If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
			$modalStore.length ? modalStore.close() : triggerSearch();
		}
	}
	
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />


<AppBar shadow="shadow-2xl" slotTrail="!space-x-2">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
				<i class="fa-solid fa-bars text-xl"></i>
			</button>
			<a class="lg:!ml-0 w-[32px] lg:w-auto overflow-hidden" href="/" title="Go to Homepage">
				<LunaLogo />
			</a>
			<span><b>LUNA</b></span>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Explore -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'features' }}>
				<span>Explore</span>
				<i class="fa-solid fa-caret-down opacity-50"></i>
			</button>
			<!-- popup -->
			<div class="card p-4 w-60 shadow-xl" data-popup="features">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/">
								<span class="w-6 text-center"><i class="fa-solid fa-home"></i></span>
								<span>Homepage</span>
							</a>
						</li>
						<li>
							<a href="/docs/get-started">
								<span class="w-6 text-center"><i class="fa-solid fa-book"></i></span>
								<span>Documentation</span>
							</a>
						</li>
						<li>
							<a href="/blog">
								<span class="w-6 text-center"><i class="fa-solid fa-bullhorn"></i></span>
								<span>Providers</span>
							</a>
						</li>
						<!-- <li>
							<a href="https://store.skeleton.dev" target="_blank">
								<span class="w-6 text-center"><i class="fa-solid fa-shopping-cart" /></span>
								<span>Skeleton Store</span>
							</a>
						</li> -->
						<hr class="!my-4" />
						<li>
							<a href="/elements/core">
								<!-- <span class="w-6 text-center"><DocsIcon name="tailwind" width="w-5" height="h-5" /></span> -->
								<span>Configuration</span>
							</a>
						</li>
						<li>
							<a href="/actions/clipboard">
								<!-- <span class="w-6 text-center"><DocsIcon name="svelte" width="w-6" height="h-6" /></span> -->
								<span>Satellites</span>
							</a>
						</li>
						<li>
							<a href="/utilities/codeblocks">
								<span class="w-6 text-center"><i class="fa-solid fa-screwdriver-wrench"></i></span>
								<span>Utilities</span>
							</a>
						</li>
					</ul>
				</nav>
				<!-- <div class="arrow bg-surface-100-800-token" /> -->
			</div>
		</div>

		<!-- Version -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'version' }}>
				<span>Version</span>
				<i class="fa-solid fa-caret-down opacity-50"></i>
			</button>
			<!-- popup -->
			<div class="card p-4 w-60 shadow-xl" data-popup="version">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="https://v1.skeleton.dev/" target="_blank">
								<span>Skeleton v1 Docs</span>
								<span class="w-6 text-center"><i class="fa-solid fa-arrow-up-right-from-square opacity-50"></i></span>
							</a>
						</li>
					</ul>
				</nav>
				<!-- <div class="arrow bg-surface-100-800-token"></div> -->
			</div>
		</div>

		<!-- Search -->
		<div class="md:inline md:ml-4">
			<button class="btn space-x-4 variant-soft hover:variant-soft-primary" on:click={triggerSearch}>
				<i class="fa-solid fa-magnifying-glass text-sm"></i>
				<small class="hidden md:inline-block">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
			</button>
		</div>
	</svelte:fragment>
</AppBar>