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
	const showArchiveShell = $derived(() => !shelllessRoutes.some((path) => $page.url.pathname.startsWith(path)));

</script>

{#if showArchiveShell}
    <ArchiveShell>
        {#snippet archiveSidebarLeft()}
        
                <ArchiveSideBar slug={$page.url.pathname} finders={data.finders} />
            
        {/snippet}
        <ImageryFinderMap finders={data.finders}></ImageryFinderMap>
        {@render children?.()}
    </ArchiveShell>
{:else}
    {@render children?.()}
{/if}

