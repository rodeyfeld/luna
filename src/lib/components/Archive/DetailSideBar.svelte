<script lang="ts">
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import DetailFinder from './DetailFinder.svelte';
    export let finderData;

</script>


<div class="grid-rows-2">
    <div class="bg-surface-500/30 p-4">
            <TabGroup>
            <div class="w-full grid grid-cols-2 gap-1" >
                <div>
                        <TabAnchor href="/archive/finder">RETURN TO LIST
                        </TabAnchor>
                </div>
            </div>
            <svelte:fragment slot="panel">
                    <DetailFinder finderData={finderData}></DetailFinder>
            </svelte:fragment>
        </TabGroup>
    </div>
</div>

