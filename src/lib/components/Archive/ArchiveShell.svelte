<div id="archive-shell" data-testid="archive-shell" class="grid grid-cols-10 h-full">
    <div class="col-span-3">
        <slot name="archiveSidebarLeft" />
    </div>

    <!-- Page -->
    <div id="archive-page" class="col-span-7">
        <!-- Slot: Page Header -->
        {#if $$slots.archivePageHeader}
            <header id="archive-page-header" class="flex-none"><slot name="archivePageHeader">(slot:archiveHeader)</slot></header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="archive-page-content" class="flex-auto w-full h-full flex overflow-hidden"><slot /></div>
    </div>
</div>
<style>
        #archive-shell {
		background-image:
			radial-gradient(at 0% 99%, rgba(var(--color-primary-500) / 0.15) 0px, transparent 50%),
			radial-gradient(at 0% 1%, rgba(var(--color-surface-500) / 0.33) 0px, transparent 50%);
	}
</style>