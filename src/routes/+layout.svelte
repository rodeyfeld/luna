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
	import "../app.css";
    import Map from '$lib/components/Map/Map.svelte';
</script>


<AppShell>
	<svelte:fragment slot="header"><LunaAppBar /></svelte:fragment>

	<svelte:fragment slot="sidebarLeft"><LunaSideBar /></svelte:fragment>
	<div class="grid grid-cols-[500px_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ?? ''}">
		<div class="bg-surface-500/30 p-4">

			<slot />
		</div>
		<div  class="bg-surface-500/30 p-4">
			<Map></Map>
		</div>
	</div>
	
	<svelte:fragment slot="pageFooter">CONNECTED</svelte:fragment>

</AppShell>