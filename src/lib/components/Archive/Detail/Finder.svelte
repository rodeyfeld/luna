<script lang="ts">
    import Datatable from './Datatable.svelte';
    import ExecuteFinder from "./ExecuteFinder.svelte";
    export let finderData;
</script>

<ExecuteFinder finderData={finderData}></ExecuteFinder>
<Datatable data={finderData}></Datatable>
