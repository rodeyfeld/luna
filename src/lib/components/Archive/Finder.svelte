<script lang="ts">
    import { finderMode } from '$lib/stores/archive_store'; 
    import ExecuteFinder from "./Detail/ExecuteFinder.svelte";
    import MapContents from "./Detail/MapContents.svelte";
    import TableContents from "./Detail/TableContents.svelte";
    export let finderData;
    export let finderResults;
    let mode = "map"
    const unsubscribe = finderMode.subscribe(value => {
        mode = value; // Update local variable whenever the store value changes
    });
</script>


<ExecuteFinder finderData={finderData}></ExecuteFinder>
{#if mode === "map"}
    <MapContents finderData={finderData} finderResults={finderResults}></MapContents>
{:else if mode === "table"}
    <TableContents finderResults={finderResults}></TableContents>
{/if}
