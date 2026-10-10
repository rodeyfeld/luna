<script lang="ts">
    interface Props {
        imagerySidebarLeft?: import('svelte').Snippet;
        imageryPageHeader?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let { imagerySidebarLeft, imageryPageHeader, children }: Props = $props();
</script>



<div id="imagery-shell" data-testid="imagery-shell" class="grid grid-cols-10 h-full">
    <div class="col-span-3">
        {@render imagerySidebarLeft?.()}
    </div>

    <!-- Page -->
    <div id="imagery-page" class="col-span-7">
        <!-- Slot: Page Header -->
        {#if imageryPageHeader}
            <header id="imagery-page-header" class="flex-none">{#if imageryPageHeader}{@render imageryPageHeader()}{:else}(slot:imageryHeader){/if}</header>
        {/if}

        <!-- Slot: Page Content (default) -->
        <div id="imagery-page-content" class="flex-auto w-full h-full flex overflow-hidden">{@render children?.()}</div>
    </div>
</div>
<style>
	#imagery-page-content {
		animation: fadeIn 0.3s ease-out;
	}
</style>