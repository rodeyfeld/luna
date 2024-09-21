<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
    import Map from '$lib/components/Map/Map.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

    let tabSet: number = 1;
    
    export let finders;
</script>


<div class="grid-rows-2">
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
                    <CreateFinder></CreateFinder>
                </form>
                {:else if tabSet === 1}
                    <ListFinders finders={finders}></ListFinders>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
    <Map />
    <div class="w-full h-full">test
    </div>

</div>

