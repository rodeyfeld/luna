<script lang="ts">
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import FinderContents from './FinderContents.svelte';
    export let finderData;
  

</script>


<div class="grid-rows-2">
    <div class=" p-4">
        <TabGroup justify="justify-center" > 
            <div class="w-full grid grid-cols-1 gap-1 justify-center" >
                <div>
                        <TabAnchor href="/archive/finder">RETURN TO LIST
                        </TabAnchor>
                </div>
            </div>
        </TabGroup>
        <!-- <TabGroup>
            <div class="w-full grid grid-cols-2 gap-1" >
                <div>
                    <Tab bind:group={$finderMode} name="mapTab" value="map">MAP</Tab>
                </div>
                <div>
                    <Tab bind:group={$finderMode} name="tableTab" value="table">TABLE</Tab>
                </div>
            </div>
            <svelte:fragment slot="panel">
            </svelte:fragment>
        </TabGroup> -->
        <FinderContents finderData={finderData}></FinderContents>
    </div>
</div>
