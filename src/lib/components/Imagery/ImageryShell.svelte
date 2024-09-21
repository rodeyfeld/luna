

<div id="imagery-shell" data-testid="imagery-shell" class="grid grid-cols-10 h-full">
    <div class="col-span-3">
        <slot name="imagerySidebarLeft" />
    </div>

    <!-- Page -->
    <div id="imagery-page" class="col-span-7">
        <!-- Slot: Page Header -->
        {#if $$slots.imageryPageHeader}
            <header id="imagery-page-header" class="flex-none"><slot name="imageryPageHeader">(slot:imageryHeader)</slot></header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="imagery-page-content" class="flex-auto w-full h-full flex overflow-hidden"><slot /></div>
    </div>
</div>