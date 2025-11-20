<script lang="ts">
    import { page } from '$app/stores';
    import CreateFinder from '$lib/components/Archive/SideBar/CreateFinder.svelte';
    import ListFinders from '$lib/components/Archive/SideBar/ListFinders.svelte';

    interface Props {
        slug: String;
        finders: any;
    }

    let { slug, finders }: Props = $props();
</script>

<div class="grid-rows-2 animate-fadeIn">
    <div class="p-4">
        <div class="flex justify-around gap-2">
            <a 
                href="/archive/create"
                class="btn flex-1 transition-smooth hover:scale-105 {$page.url.pathname.includes('create') ? 'variant-filled-primary' : 'variant-soft'}"
            >
                CREATE
            </a>
            <a 
                href="/archive/finder"
                class="btn flex-1 transition-smooth hover:scale-105 {$page.url.pathname.includes('finder') ? 'variant-filled-primary' : 'variant-soft'}"
            >
                VIEW
            </a>
        </div>
    </div>
    <div class="p-4">
        {#if slug.includes('create')}
            <form method="POST" action="create?/submit">
                <CreateFinder></CreateFinder>
            </form>
        {:else if slug.includes('finder')}
            <ListFinders finders={finders}></ListFinders>
        {/if}
    </div>
</div>

