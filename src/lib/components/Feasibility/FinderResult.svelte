<script lang="ts">
    import ExecuteFinder from "./FeasibilityResultPanel/ExecuteFinder.svelte";
    import ResultContents from "./FeasibilityResultPanel/ResultContents.svelte";
    export let finder;
    export let results;

</script>
<ExecuteFinder finder={finder}></ExecuteFinder>
<ResultContents results={results}></ResultContents>
