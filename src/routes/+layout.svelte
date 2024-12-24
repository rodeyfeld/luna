<script lang="ts">
    import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import LunaAppBar from '$lib/components/Luna/LunaAppBar/LunaAppBar.svelte'
	import LunaSideBar from '$lib/components/Luna/LunaSideBar/LunaSideBar.svelte'
    import LunaFooterBar from '$lib/components/Luna/LunaFooterBar/LunaFooterBar.svelte';
	import "../app.css";
    import LunaShell from '$lib/components/LunaShell.svelte';

	import { storePopup } from '@skeletonlabs/skeleton';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<LunaShell>
	{#snippet header()}
		<LunaAppBar />
	{/snippet}
	{#snippet sidebar()}
		<LunaSideBar />
	{/snippet}
	{@render children?.()} 
	{#snippet footer()}
		<LunaFooterBar />
	{/snippet}
</LunaShell>