<script lang="ts">
    import Finder from "$lib/components/Feasibility/Finder.svelte";
	import type { PageData } from './$types';
    export let data: PageData;
</script>

<div  class="bg-surface-500/30 p-4">
    <Finder finderData={data.finderData} finderResults={data.finderResults}></Finder>        
</div>