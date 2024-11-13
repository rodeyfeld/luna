<script lang="ts">
	import { page } from '$app/stores';

	// import DocsIcon from '$lib/components/DocsIcon/DocsIcon.svelte';
	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';


	// Lifecycle
	page.subscribe((page) => {

	});
let tabSet: number = 0;

	// Reactive
</script>

<!-- App Rail -->
<AppRail background="bg-transparent" border="border-r border-surface-500/30">
	<AppRailAnchor selected={$page.url.pathname === '/imagery'} name="imagery" href='/imagery'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-images text-2xl"></i></svelte:fragment>
		<span>IMAGERY</span>
	</AppRailAnchor>
	<hr class="opacity-30" />
	<!-- <AppRailAnchor selected={$page.url.pathname === '/order'} name="order" href='/order'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-camera text-2xl"></i></svelte:fragment>
		<span>ORDERS</span>
	</AppRailAnchor> -->
	<hr class="opacity-30" />

	<!-- <AppRailAnchor selected={$page.url.pathname === '/solver'} name="solver" href='/solver'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-hat-wizard text-2xl"></i></svelte:fragment>
		<span>SOLVER</span>
	</AppRailAnchor> -->

	<hr class="opacity-30" />
	<AppRailAnchor selected={$page.url.pathname === '/archive'} name="archive" href='/archive'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-photo-film text-2xl"></i></svelte:fragment>
		<span>ARCHIVE</span>
	</AppRailAnchor>
</AppRail>