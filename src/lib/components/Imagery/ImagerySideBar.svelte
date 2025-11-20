<script lang="ts">
    import CreateImagery from '$lib/components/Imagery/CreateImagery.svelte';
    import ListImagery from '$lib/components/Imagery/ListImagery.svelte';
    let { images } = $props();
    let activeTab = $state<'create' | 'view'>('create');
</script>

<div class="p-4 animate-fadeIn">
    <div class="w-full grid grid-cols-2 gap-2">
        <button
            type="button"
            class={`btn w-full transition-smooth ${activeTab === 'create' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
            onclick={() => (activeTab = 'create')}
        >
            CREATE
        </button>
        <button
            type="button"
            class={`btn w-full transition-smooth ${activeTab === 'view' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
            onclick={() => (activeTab = 'view')}
        >
            VIEW
        </button>
    </div>

    {#if activeTab === 'create'}
        <div class="mt-4">
            <form method="POST" action="?/submit">
                <CreateImagery />
            </form>
        </div>
    {:else}
        <div class="mt-4">
            <ListImagery images={images} />
        </div>
    {/if}
</div>