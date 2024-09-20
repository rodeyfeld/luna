<script lang="ts">

    import FinderResult from "$lib/components/Feasibility/FinderResult.svelte";
    import type { PageData } from './$types'

    let currentFinder: string = "";
    export let data: PageData;
</script>

<div  class="bg-surface-500/30 p-4">
    <FinderResult finder={currentFinder} results={data}></FinderResult>
</div>