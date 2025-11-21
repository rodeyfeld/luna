<script lang="ts">
    import ArchiveSideBar from '$lib/components/Archive/SideBar/ArchiveSideBar.svelte';
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
    import { page } from '$app/stores';  
    import ImageryFinderMap from '$lib/components/Archive/ImageryFinderMap.svelte';
	interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();
	const shelllessRoutes = ['/archive/create'];
	const showArchiveShell = $derived(!shelllessRoutes.some((path) => $page.url.pathname.startsWith(path)));
	
	// Hide the big map on finder detail pages
	const showBigMap = $derived(!$page.url.pathname.includes('/archive/finder/'));
	
	// Filter finders based on current finder's location (for detail pages)
	const filteredFinders = $derived(() => {
		// Get current finder from page data if on a detail page
		const currentFinder = $page.data.finderData;
		
		if (currentFinder?.location?.id) {
			// Filter to only show finders with the same location
			return data.finders.filter((f: any) => f.location?.id === currentFinder.location.id);
		}
		
		// Show all finders on other pages
		return data.finders;
	});

</script>

{#if showArchiveShell}
    <ArchiveShell>
        {#snippet archiveSidebarLeft()}
        
                <ArchiveSideBar slug={$page.url.pathname} finders={filteredFinders()} />
            
        {/snippet}
        {#if showBigMap}
            <ImageryFinderMap finders={data.finders}></ImageryFinderMap>
        {/if}
        {@render children?.()}
    </ArchiveShell>
{:else}
    {@render children?.()}
{/if}
