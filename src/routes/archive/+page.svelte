<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from './$types'
    let tabSet: number = 0;
    export let data: PageData;
</script>

<!-- 
<div class="bg-surface-500/30 p-4">
<TabGroup>
    <div class="w-full grid grid-cols-2 gap-1" >
        <div>
            <Tab bind:group={tabSet} name="create" value={0}>CREATE
            </Tab>
        </div>
        <div>
            <Tab bind:group={tabSet} name="view" value={1}>VIEW
            </Tab>
        </div>
    </div>
    <svelte:fragment slot="panel">
        {#if tabSet === 0}
            <CreateFinder images={data.images}></CreateFinder>
        {:else if tabSet === 1}
            <ListFinders images={data.images}></ListFinders>
        {/if}
    </svelte:fragment>
</TabGroup>
</div> -->