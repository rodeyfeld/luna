<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    let tabSet: number = 0;
</script>


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
            <form method="POST" action="?/submit">
                <CreateFinder images={data.images}></CreateFinder>
            </form>
            {:else if tabSet === 1}
                <ListFinders bind:finderValue={currentFinder}  finders={data.finders}></ListFinders>
            {/if}
        </svelte:fragment>
    </TabGroup>
</div>
<slot />