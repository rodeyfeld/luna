<script lang="ts">
    import CreateImagery from '$lib/components/Imagery/CreateImagery.svelte';
    import ListImagery from '$lib/components/Imagery/ListImagery.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

    let tabSet: number = $state(0);
    let { images } = $props();
</script>


<div class="p-4">
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
        {#snippet panel()}
            
                {#if tabSet === 0}
                <form method="POST" action="?/submit">
                    <CreateImagery></CreateImagery>
                </form>
                {:else if tabSet === 1}
                    <ListImagery images={images}></ListImagery>
                {/if}
            
            {/snippet}
    </TabGroup>
</div>