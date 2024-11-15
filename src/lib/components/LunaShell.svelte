<div id="luna-shell" data-testid="luna-shell" class="grid h-screen grid-rows-[auto_1fr_auto]">
    {#if $$slots.header}
        <header id="luna-page-header" class="p-4"><slot name="header">(slot:lunaHeader)</slot></header>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
        {#if $$slots.sidebar}
            <aside  id="luna-page-sidebar" class="p-4 "><slot name="sidebar">(slot:lunaSidebar)</slot></aside>
        {/if}
        <main id="luna-page-content" class="space-y-4">
            <slot />
        </main>
    </div>
    {#if $$slots.footer}
    <footer id="shell-footer" class="p-4"><slot name="footer" /></footer>
    {/if}
</div>