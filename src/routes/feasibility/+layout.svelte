<script lang="ts">
    import FeasibilitySideBar from '$lib/components/Feasibility/FeasibilitySideBar.svelte';
    import FeasibilityShell from '$lib/components/Feasibility/FeasibilityShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
    import { page } from '$app/stores';  

</script>

<FeasibilityShell>
    <svelte:fragment slot="feasibilitySidebarLeft">
        <FeasibilitySideBar slug={$page.url.pathname} finders={data.finders} images={data.images}/>
    </svelte:fragment>
    <slot /> 
</FeasibilityShell>