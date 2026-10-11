<script lang="ts">
    import { page } from '$app/stores';
    import { Plus } from '@lucide/svelte';
    import MoonPhase from '$lib/components/shared/MoonPhase.svelte';
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

<div class="flex h-full max-h-[inherit] flex-col">
    <div class="border-b border-line p-4">
        <a href={createUrl()} class="btn btn-primary w-full">
            <Plus size={14} strokeWidth={1.5} />
            <span>New finder</span>
        </a>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
        {#if isCreatePage}
            <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
                <MoonPhase phase="new" size={28} class="text-shade" />
                <p class="eyebrow">Drafting a new finder</p>
            </div>
        {:else}
            <ListFinders finders={finders} />
        {/if}
    </div>
</div>
