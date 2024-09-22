<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
    import Map from '$lib/components/Map/Map.svelte';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';

    let tabSet: number = 1;
    export let slug;
    export let images;
    export let finders;
</script>


<div class="grid-rows-2">
    <div class="bg-surface-500/30 p-4">
            <TabGroup>
            <div class="w-full grid grid-cols-2 gap-1" >
                <div>

                        <TabAnchor href="/feasibility/create">CREATE
                        </TabAnchor>

                </div>
                <div>
                        <TabAnchor href="/feasibility/finder">VIEW
                        </TabAnchor>
                </div>
            </div>        
            <svelte:fragment slot="panel">
                {#if slug.includes('create')}
                <form method="POST" action="create?/submit">
                    <CreateFinder images={images}></CreateFinder>
                </form>
                {:else if slug.includes('finder')}
                    <ListFinders finders={finders}></ListFinders>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
</div>

