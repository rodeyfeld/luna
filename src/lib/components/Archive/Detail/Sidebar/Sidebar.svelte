<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
    import FinderContents from './Contents.svelte';
    export let finderData;
</script>

<div class="grid-rows-2">
    <div class=" p-4">
        <TabGroup justify="justify-center"  flex="auto" > 

                        <TabAnchor class="bg-secondary-500 flex-1" href="/archive/finder" selected={true}>RETURN TO LIST
                        </TabAnchor>

        </TabGroup>
        <FinderContents finderData={finderData}></FinderContents>
    </div>
</div>
