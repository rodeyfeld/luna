<script lang="ts">
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
    import { page } from '$app/stores';  
    import Sidebar from '$lib/components/Archive/Detail/Sidebar/Sidebar.svelte';

</script>

<ArchiveShell>
    <svelte:fragment slot="archiveSidebarLeft">
        <Sidebar finderData={data.finderData}/>
    </svelte:fragment>
    <slot /> 
</ArchiveShell>