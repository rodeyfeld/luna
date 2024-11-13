<div id="study-shell" data-testid="study-shell" class="h-full">

    <!-- Page -->

        <!-- Slot: Page Header -->
        {#if $$slots.studyPageHeader}
            <header id="study-page-header" class="flex-none"><slot name="studyPageHeader">(slot:studyHeader)</slot></header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="study-page-content" class="flex-auto w-full h-full flex overflow-hidden"><slot /></div>
</div>