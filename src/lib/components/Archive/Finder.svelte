<script lang="ts">
    import ExecuteFinder from "./Detail/ExecuteFinder.svelte";
    import ResultContents from "./Detail/ResultContents.svelte";
    export let finderData;
    export let finderResults;

</script>
<ExecuteFinder finderData={finderData}></ExecuteFinder>
<ResultContents finderResults={finderResults}></ResultContents>
