<script lang="ts">
    interface Props {
        archiveSidebarLeft?: import('svelte').Snippet;
        archivePageHeader?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let { archiveSidebarLeft, archivePageHeader, children }: Props = $props();
</script>

<div
    id="archive-shell"
    data-testid="archive-shell"
    class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]"
>
    <aside class="panel min-w-0 overflow-hidden max-h-[22rem] lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start">
        {@render archiveSidebarLeft?.()}
    </aside>

    <!-- Page -->
    <div id="archive-page" class="min-w-0">
        {#if archivePageHeader}
            <header id="archive-page-header" class="mb-6">{@render archivePageHeader()}</header>
        {/if}

        <div id="archive-page-content" class="min-w-0 space-y-6">{@render children?.()}</div>
    </div>
</div>

<style>
    #archive-page-content {
        animation: fadeIn 0.4s ease-out both;
    }
</style>
