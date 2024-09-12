<script lang="ts">
    import CreateImagery from '$lib/components/Imagery/CreateImagery.svelte';
    import ListImagery from '$lib/components/Imagery/ListImagery.svelte';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';

    let tabSet: number = 0;
</script>


<TabGroup  >
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
                <CreateImagery></CreateImagery>
            {:else if tabSet === 1}
                <ListImagery></ListImagery>
            {/if}
        </svelte:fragment>
    </TabGroup>