<script lang="ts">
    import { page } from '$app/stores';
    
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

<div class="space-y-2">
    <div class="px-3 mb-3">
        <div class="text-xs uppercase tracking-wider text-surface-400">
            Imagery Finders ({finders?.length || 0})
        </div>
        {#if isFiltered && currentFinder?.location?.name}
            <div class="text-xs text-surface-500 mt-1">
                For: {currentFinder.location.name}
            </div>
        {/if}
    </div>
    
    {#if finders && finders.length > 0}
        <div class="space-y-1">
            {#each finders as finder}
                <a
                    href="/archive/finder/{finder.id}"
                    class="block px-3 py-2.5 rounded-lg transition-all {currentFinderId === String(finder.id) ? 'bg-primary-500/20 border-l-2 border-primary-500' : 'hover:bg-surface-800/50'}"
                >
                    <div class="flex items-start justify-between gap-2 mb-1">
                        <span class="font-medium text-sm truncate">{finder.name}</span>
                        {#if finder.is_active}
                            <span class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></span>
                        {/if}
                    </div>
                    <div class="text-xs text-surface-400">
                        {formatDate(finder.start_date)} - {formatDate(finder.end_date)}
                    </div>
                    {#if finder.studies && finder.studies.length > 0}
                        <div class="text-xs text-surface-500 mt-1">
                            {finder.studies.length} {finder.studies.length === 1 ? 'study' : 'studies'}
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    {:else}
        <div class="px-3 py-6 text-center">
            <div class="text-3xl mb-2 opacity-20">🗺️</div>
            <p class="text-xs text-surface-500">No finders yet</p>
        </div>
    {/if}
</div>
