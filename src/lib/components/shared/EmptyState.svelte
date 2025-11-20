<script lang="ts">
    import type { Snippet } from 'svelte';
    
    interface Props {
        icon: string;
        title: string;
        description?: string;
        action?: Snippet;
    }
    
    let { icon, title, description, action }: Props = $props();
</script>

<div class="text-center py-12 px-4">
    <div class="text-6xl mb-4 opacity-30">{icon}</div>
    <h3 class="text-xl font-semibold mb-2">{title}</h3>
    {#if description}
        <p class="text-surface-600-300-token mb-6 max-w-md mx-auto">{description}</p>
    {/if}
    {#if action}
        {@render action()}
    {/if}
</div>

