<script lang="ts">
    import ArchiveSideBar from '$lib/components/Archive/SideBar/ArchiveSideBar.svelte';
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
    import { page } from '$app/stores';  
    import ArchiveFinderMap from '$lib/components/Archive/ArchiveFinderMap.svelte';
    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();

</script>

<ArchiveShell>
    {#snippet archiveSidebarLeft()}
    
            <ArchiveSideBar slug={$page.url.pathname} finders={data.finders} />
        
    {/snippet}
    <ArchiveFinderMap finders={data.finders}></ArchiveFinderMap>
    {@render children?.()}
</ArchiveShell>

