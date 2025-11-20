<script lang="ts">
    interface Props {
        size?: 'sm' | 'md' | 'lg';
        message?: string;
    }
    
    let { size = 'md', message }: Props = $props();
    
    const sizeClass = {
        'sm': 'h-8 w-8',
        'md': 'h-16 w-16',
        'lg': 'h-24 w-24'
    }[size];
</script>

<style>
    .spinner-pinwheel {
        animation: rotate-pinwheel 2s linear infinite;
        filter: drop-shadow(0 0 8px rgba(var(--color-primary-500) / 0.3));
    }
    
    @keyframes rotate-pinwheel {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>

<div class="flex flex-col items-center justify-center gap-4 py-8">
    <img 
        src="/pinwheel.svg" 
        alt="Loading..."
        class="spinner-pinwheel {sizeClass}"
    />
    {#if message}
        <p class="text-surface-600-300-token">{message}</p>
    {/if}
</div>
