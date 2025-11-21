<script lang="ts">
    import { page } from '$app/stores';
    import ListFinders from '$lib/components/Archive/SideBar/ListFinders.svelte';

    interface Props {
        slug: String;
        finders: any;
    }

    let { slug, finders }: Props = $props();
    
    const isCreatePage = $derived($page.url.pathname.includes('create'));
    const currentFinderId = $derived($page.params.slug);
    
    // Build create URL with location ID if on a finder detail page
    const createUrl = $derived(() => {
        const finderData = $page.data.finderData;
        if (finderData?.location?.id) {
            return `/archive/create?geometryId=${finderData.location.id}`;
        }
        return '/archive/create';
    });
</script>

<div class="h-full flex flex-col">
    <!-- Header with Create Button -->
    <div class="p-4 border-b border-surface-700/50">
        <a 
            href={createUrl()}
            class="btn variant-filled-primary w-full"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Finder</span>
        </a>
    </div>
    
    <!-- Finders List -->
    <div class="flex-1 overflow-y-auto p-4">
        {#if isCreatePage}
            <div class="text-center py-8">
                <div class="text-4xl mb-3 opacity-20">✨</div>
                <p class="text-sm text-surface-400">Creating new imagery finder</p>
            </div>
        {:else}
            <ListFinders finders={finders} />
        {/if}
    </div>
</div>
