<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
    import FinderContents from './Contents.svelte';
    let { finderData } = $props();
</script>

<div class="grid-rows-2 animate-fadeIn">
    <div class="p-4">
        <TabGroup justify="justify-center" flex="auto">
            <TabAnchor 
                class="bg-secondary-500 flex-1 transition-smooth hover:scale-105" 
                href="/archive/finder" 
                selected={true}
            >
                <i class="fa-solid fa-arrow-left mr-2"></i>
                RETURN TO LIST
            </TabAnchor>
        </TabGroup>
        <FinderContents finderData={finderData}></FinderContents>
    </div>
</div>
