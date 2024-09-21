<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from './$types'
    import FinderResult from '$lib/components/Feasibility/FinderResult.svelte';
    import { getContext } from 'svelte';
    import FeasibilitySideBar from '$lib/components/Feasibility/FeasibilitySideBar.svelte';
    import FeasibilityShell from '$lib/components/Feasibility/FeasibilityShell.svelte';
    import feasiblity_store from '$lib/stores/feasiblity_store';
    let tabSet: number = 0;
    let currentFinder: string = "";



</script>


<FeasibilityShell>
    <svelte:fragment slot="feasibilitySidebarLeft">
        <FeasibilitySideBar data={$feasiblity_store}  />
    </svelte:fragment>
    <slot /> 
</FeasibilityShell>