<script lang="ts">
    interface Props {
        archiveSidebarLeft?: import('svelte').Snippet;
        archivePageHeader?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let { archiveSidebarLeft, archivePageHeader, children }: Props = $props();
</script>

<div id="archive-shell" data-testid="archive-shell" class="grid grid-cols-10 h-full">
    <div class="col-span-3">
        {@render archiveSidebarLeft?.()}
    </div>

    <!-- Page -->
    <div id="archive-page" class="col-span-7">
        <!-- Slot: Page Header -->
        {#if archivePageHeader}
            <header id="archive-page-header" class="flex-none">{#if archivePageHeader}{@render archivePageHeader()}{:else}(slot:archiveHeader){/if}</header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="archive-page-content" class="flex-auto w-full h-full flex overflow-hidden">{@render children?.()}</div>
    </div>
</div>
<style>
	#archive-page-content {
		animation: fadeIn 0.3s ease-out;
	}
</style>