<script>
		// Dependency: Floating UI
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// SvelteKit Imports
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';


	
    import { AppShell, Modal, Toast, initializeStores, prefersReducedMotionStore } from '@skeletonlabs/skeleton';
	initializeStores();

	import LunaAppBar from '$lib/components/LunaAppBar/LunaAppBar.svelte'
	import LunaSideBar from '$lib/components/LunaSideBar/LunaSideBar.svelte'
    import LunaFooterBar from '$lib/components/LunaFooterBar/LunaFooterBar.svelte';
	import "../app.css";
    import Map from '$lib/components/Map/Map.svelte';
</script>


<AppShell>
	<svelte:fragment slot="header"><LunaAppBar /></svelte:fragment>

	<svelte:fragment slot="sidebarLeft"><LunaSideBar /></svelte:fragment>
	
	<slot /> 

	<svelte:fragment slot="pageFooter"><LunaFooterBar /></svelte:fragment>

</AppShell>