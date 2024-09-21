<script lang="ts">
    import ExecuteFinder from "./FeasibilityResultPanel/ExecuteFinder.svelte";
    import ResultContents from "./FeasibilityResultPanel/ResultContents.svelte";
    export let finder_data;
    export let finder_results;

</script>
<ExecuteFinder finder_data={finder_data}></ExecuteFinder>
<ResultContents finder_results={finder_results}></ResultContents>
