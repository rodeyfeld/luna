<script lang="ts">
    import { page } from '$app/stores';
    import CreateFinder from '$lib/components/Archive/SideBar/CreateFinder.svelte';
    import ListFinders from '$lib/components/Archive/SideBar/ListFinders.svelte';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';

    interface Props {
        slug: String;
        finders: any;
    }

    let { slug, finders }: Props = $props();


    const getFinderMode = () => $page.url.pathname.includes('create') ? "create" : "list";


</script>


<div class="grid-rows-2">
    <div class="p-4">
            <TabGroup justify="justify-around" flex="auto">
                <TabAnchor class="flex-1"  href="/archive/create" name="create" selected={$page.url.pathname.includes('create')}>CREATE
                </TabAnchor>
    
                <TabAnchor class="flex-1"  href="/archive/finder" name="finder" selected={$page.url.pathname.includes('finder')}>VIEW
                </TabAnchor>            
            </TabGroup>

    </div>
        <div  class="p-4">
            {#if slug.includes('create')}
            <form method="POST" action="create?/submit">
                <CreateFinder></CreateFinder>
            </form>
            {:else if slug.includes('finder')}
                <ListFinders finders={finders}></ListFinders>
            {/if}
        </div>

</div>

