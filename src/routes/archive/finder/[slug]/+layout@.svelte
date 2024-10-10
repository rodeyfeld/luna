<script lang="ts">
    import DetailSideBar from '$lib/components/Archive/DetailSideBar.svelte';
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
    import { page } from '$app/stores';  

</script>

<ArchiveShell>
    <svelte:fragment slot="archiveSidebarLeft">
        <DetailSideBar/>
    </svelte:fragment>
    <slot /> 
</ArchiveShell>