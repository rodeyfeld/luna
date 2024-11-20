<script lang="ts">
    import Finder from "$lib/components/Archive/Finder.svelte";
	import type { PageData } from './$types';
    export let data: PageData;
</script>

<div  class="p-4">
    <Finder finderData={data.finderData}></Finder>        
</div>