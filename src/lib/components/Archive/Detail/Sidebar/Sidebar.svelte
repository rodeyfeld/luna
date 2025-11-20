<script lang="ts">
    import FinderContents from './Contents.svelte';
    let { finderData } = $props();
</script>

<div class="grid-rows-2 animate-fadeIn">
    <div class="p-4">
        <a 
            href="/archive/finder"
            class="btn variant-filled-secondary w-full transition-smooth hover:scale-105"
        >
            <i class="fa-solid fa-arrow-left mr-2"></i>
            RETURN TO LIST
        </a>
        <FinderContents finderData={finderData}></FinderContents>
    </div>
</div>
