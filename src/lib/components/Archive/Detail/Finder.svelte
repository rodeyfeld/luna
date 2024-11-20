<script lang="ts">
    import { finderMode } from '$lib/stores/archive_store'; 
    import ExecuteFinder from "./ExecuteFinder.svelte";
    import TableContents from "./TableContents.svelte";
    export let finderData;
</script>

<ExecuteFinder finderData={finderData}></ExecuteFinder>
<TableContents finderData={finderData}></TableContents>
