<script lang="ts">
    import ExecuteFinder from "./FeasibilityResultPanel/ExecuteFinder.svelte";
    import ResultContents from "./FeasibilityResultPanel/ResultContents.svelte";
    export let finderData;
    export let finderResults;

</script>
<ExecuteFinder finderData={finderData}></ExecuteFinder>
<ResultContents finderResults={finderResults}></ResultContents>
