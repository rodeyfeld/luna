<script lang="ts">
    import Finder from "$lib/components/Archive/Detail/Finder.svelte";
	import type { PageData } from './$types';
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<div  class="p-4">
    <Finder finderData={data.finderData}></Finder>        
</div>