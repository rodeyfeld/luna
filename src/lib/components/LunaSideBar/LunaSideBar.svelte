<script lang="ts">
	import { page } from '$app/stores';

	// import DocsIcon from '$lib/components/DocsIcon/DocsIcon.svelte';
	import { menuNavLinks } from '$lib/links';
	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import CreateImagery from '../Imagery/CreateImagery.svelte';
    import ListImagery from '../Imagery/ListImagery.svelte';
	// Local
	let currentRailCategory: keyof typeof menuNavLinks | undefined = undefined;
	const drawerStore = getDrawerStore();

	function onClickAnchor(): void {
		currentRailCategory = undefined;
		drawerStore.close();
	}

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
	<AppRailAnchor selected={$page.url.pathname === '/order'} name="order" href='/order'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-camera text-2xl"></i></svelte:fragment>
		<span>ORDERS</span>
	</AppRailAnchor>
	<hr class="opacity-30" />

	<AppRailAnchor selected={$page.url.pathname === '/solver'} name="solver" href='/solver'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-hat-wizard text-2xl"></i></svelte:fragment>
		<span>SOLVER</span>
	</AppRailAnchor>
	
	<AppRailAnchor selected={$page.url.pathname === '/feasibility'} name="feasibility" href='/feasibility'>
		<svelte:fragment slot="lead"><i class="fa-regular fa-eye text-2xl"></i></svelte:fragment>
		<span>FEASIBIILTY</span>
	</AppRailAnchor>
	<hr class="opacity-30" />
	<AppRailAnchor selected={$page.url.pathname === '/archive'} name="archive" href='/archive'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-photo-film text-2xl"></i></svelte:fragment>
		<span>ARCHIVE</span>
	</AppRailAnchor>
</AppRail>