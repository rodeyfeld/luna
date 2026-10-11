<script lang="ts">
    import { page } from '$app/stores';
    import MoonPhase from '$lib/components/shared/MoonPhase.svelte';

    let { finders } = $props();

    const currentFinderId = $derived($page.params.slug);
    const currentFinder = $derived($page.data.finderData);
    const isFiltered = $derived(currentFinder?.location?.id && finders?.length > 0);

    function formatDate(dateStr: string) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }
</script>

<div>
    <div class="flex items-baseline justify-between gap-2 px-4 pt-4 pb-3">
        <p class="eyebrow">Finders</p>
        <p class="readout text-xs text-haze">{String(finders?.length || 0).padStart(2, '0')}</p>
    </div>
    {#if isFiltered && currentFinder?.location?.name}
        <p class="-mt-1 truncate px-4 pb-3 text-xs text-haze">
            at <span class="text-dust">{currentFinder.location.name}</span>
        </p>
    {/if}

    {#if finders && finders.length > 0}
        <div class="border-t border-line">
            {#each finders as finder}
                <a
                    href="/archive/finder/{finder.id}"
                    class="row {currentFinderId === String(finder.id) ? 'is-active' : ''}"
                    aria-current={currentFinderId === String(finder.id) ? 'page' : undefined}
                >
                    <div class="flex items-start justify-between gap-2">
                        <span class="truncate text-sm text-moon">{finder.name}</span>
                        {#if finder.is_active}
                            <MoonPhase phase="full" size={9} class="mt-1.5 text-sage" />
                        {/if}
                    </div>
                    <div class="readout mt-1 text-[0.7rem] text-haze">
                        {formatDate(finder.start_date)} – {formatDate(finder.end_date)}
                    </div>
                    {#if finder.studies && finder.studies.length > 0}
                        <div class="readout mt-0.5 text-[0.7rem] text-shade">
                            {finder.studies.length} {finder.studies.length === 1 ? 'study' : 'studies'}
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    {:else}
        <div class="flex flex-col items-center gap-3 border-t border-line px-4 py-10 text-center">
            <MoonPhase phase="new" size={24} class="text-shade" />
            <p class="text-xs text-haze">No finders yet</p>
        </div>
    {/if}
</div>
