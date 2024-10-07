<script lang="ts">
    import CreateFinder from '$lib/components/Archive/CreateFinder.svelte';
    import ListFinders from '$lib/components/Archive/ListFinders.svelte';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';

    export let slug;
    export let finders;
</script>


<div class="grid-rows-2">
    <div class="bg-surface-500/30 p-4">
            <TabGroup>
            <div class="w-full grid grid-cols-2 gap-1" >
                <div>

                        <TabAnchor href="/archive/create">CREATE
                        </TabAnchor>

                </div>
                <div>
                        <TabAnchor href="/archive/finder">VIEW
                        </TabAnchor>
                </div>
            </div>        
            <svelte:fragment slot="panel">
                {#if slug.includes('create')}
                <form method="POST" action="create?/submit">
                    <CreateFinder></CreateFinder>
                </form>
                {:else if slug.includes('finder')}
                    <ListFinders finders={finders}></ListFinders>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
</div>

