<div id="feasibility-shell" data-testid="feasibility-shell" class="grid grid-cols-10 h-full">
    <div class="col-span-3">
        <slot name="feasibilitySidebarLeft" />
    </div>

    <!-- Page -->
    <div id="feasibility-page" class="col-span-7">
        <!-- Slot: Page Header -->
        {#if $$slots.feasibilityPageHeader}
            <header id="feasibility-page-header" class="flex-none"><slot name="feasibilityPageHeader">(slot:feasibilityHeader)</slot></header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="feasibility-page-content" class="flex-auto w-full h-full flex overflow-hidden"><slot /></div>
    </div>
</div>