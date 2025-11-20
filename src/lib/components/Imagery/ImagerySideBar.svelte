<script lang="ts">
    import CreateImagery from '$lib/components/Imagery/CreateImagery.svelte';
    import ListImagery from '$lib/components/Imagery/ListImagery.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

    let { images } = $props();
</script>

<div class="p-4 animate-fadeIn">
    <Tabs defaultValue="create">
        <Tabs.List class="w-full grid grid-cols-2 gap-2">
            <Tabs.Trigger value="create" class="transition-smooth hover:scale-105">
                CREATE
            </Tabs.Trigger>
            <Tabs.Trigger value="view" class="transition-smooth hover:scale-105">
                VIEW
            </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="create" class="mt-4">
            <form method="POST" action="?/submit">
                <CreateImagery></CreateImagery>
            </form>
        </Tabs.Content>
        <Tabs.Content value="view" class="mt-4">
            <ListImagery images={images}></ListImagery>
        </Tabs.Content>
    </Tabs>
</div>