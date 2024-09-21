<script lang="ts">
    import FeasibilitySideBar from '$lib/components/Feasibility/FeasibilitySideBar.svelte';
    import FeasibilityShell from '$lib/components/Feasibility/FeasibilityShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>


<FeasibilityShell>
    <svelte:fragment slot="feasibilitySidebarLeft">
        <FeasibilitySideBar finders={data.finders} images={data.images}/>
    </svelte:fragment>
    <slot /> 
</FeasibilityShell>