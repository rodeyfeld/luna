<div id="luna-shell" data-testid="luna-shell" class="grid h-screen grid-rows-[auto_1fr_auto]">
    {#if $$slots.header}
        <header id="luna-page-header"><slot name="header">(slot:lunaHeader)</slot></header>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
        {#if $$slots.sidebar}
            <aside  id="luna-page-sidebar"><slot name="sidebar">(slot:lunaSidebar)</slot></aside>
        {/if}
        <main id="luna-page-content" >
            <slot />
        </main>
    </div>
    {#if $$slots.footer}
    <footer id="shell-footer" class="p-1"><slot name="footer" /></footer>
    {/if}
</div>

