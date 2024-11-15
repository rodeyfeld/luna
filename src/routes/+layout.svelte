<script>
    import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import LunaAppBar from '$lib/components/LunaAppBar/LunaAppBar.svelte'
	import LunaSideBar from '$lib/components/LunaSideBar/LunaSideBar.svelte'
    import LunaFooterBar from '$lib/components/LunaFooterBar/LunaFooterBar.svelte';
	import "../app.css";
    import LunaShell from '$lib/components/LunaShell.svelte';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<LunaShell>
	<svelte:fragment slot="header"><LunaAppBar /></svelte:fragment>
	<svelte:fragment slot="sidebar"><LunaSideBar /></svelte:fragment>
	<slot /> 
	<svelte:fragment slot="footer"><LunaFooterBar /></svelte:fragment>
</LunaShell>