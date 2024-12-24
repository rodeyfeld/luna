<script lang="ts">
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
    import { page } from '$app/stores';  
    import Sidebar from '$lib/components/Archive/Detail/Sidebar/Sidebar.svelte';
    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();

</script>

<ArchiveShell>
    {#snippet archiveSidebarLeft()}
    
            <Sidebar finderData={data.finderData}/>
        
    {/snippet}
    {@render children?.()} 
</ArchiveShell>