<script lang="ts">
    import ArchiveSideBar from '$lib/components/Archive/ArchiveSideBar.svelte';
    import ArchiveShell from '$lib/components/Archive/ArchiveShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
    import { page } from '$app/stores';  

</script>

<ArchiveShell>
    <svelte:fragment slot="archiveSidebarLeft">
        <ArchiveSideBar slug={$page.url.pathname} finders={data.finders} />
    </svelte:fragment>
    <slot /> 
</ArchiveShell>