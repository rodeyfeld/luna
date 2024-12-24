<script lang="ts">
    import Datatable from './Datatable.svelte';
    import ExecuteFinder from "./ExecuteFinder.svelte";
    let { finderData } = $props();
</script>

<ExecuteFinder finderData={finderData}></ExecuteFinder>
<Datatable data={finderData}></Datatable>
