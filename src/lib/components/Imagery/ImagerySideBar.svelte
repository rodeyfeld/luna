<script lang="ts">
    import CreateImagery from '$lib/components/Imagery/CreateImagery.svelte';
    import ListImagery from '$lib/components/Imagery/ListImagery.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

    let tabSet: number = $state(0);
    let { images } = $props();
</script>

<div class="p-4 animate-fadeIn">
    <TabGroup>
        <div class="w-full grid grid-cols-2 gap-2">
            <Tab bind:group={tabSet} name="create" value={0} class="transition-smooth hover:scale-105">
                CREATE
            </Tab>
            <Tab bind:group={tabSet} name="view" value={1} class="transition-smooth hover:scale-105">
                VIEW
            </Tab>
        </div>
        {#snippet panel()}
            {#if tabSet === 0}
                <form method="POST" action="?/submit" class="mt-4">
                    <CreateImagery></CreateImagery>
                </form>
            {:else if tabSet === 1}
                <div class="mt-4">
                    <ListImagery images={images}></ListImagery>
                </div>
            {/if}
        {/snippet}
    </TabGroup>
</div>