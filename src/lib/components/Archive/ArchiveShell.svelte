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