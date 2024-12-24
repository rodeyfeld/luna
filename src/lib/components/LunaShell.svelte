<script lang="ts">
    interface Props {
        header?: import('svelte').Snippet;
        sidebar?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
        footer?: import('svelte').Snippet;
    }

    let {
        header,
        sidebar,
        children,
        footer
    }: Props = $props();
</script>

<div id="luna-shell" data-testid="luna-shell" class="grid h-screen grid-rows-[auto_1fr_auto]">
    {#if header}
        <header id="luna-page-header">{#if header}{@render header()}{:else}(slot:lunaHeader){/if}</header>
    {/if}
    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
        {#if sidebar}
            <aside  id="luna-page-sidebar">{#if sidebar}{@render sidebar()}{:else}(slot:lunaSidebar){/if}</aside>
        {/if}
        <main id="luna-page-content" >
            {@render children?.()}
        </main>
    </div>
    {#if footer}
    <footer id="shell-footer" class="p-1">{@render footer?.()}</footer>
    {/if}
</div>

