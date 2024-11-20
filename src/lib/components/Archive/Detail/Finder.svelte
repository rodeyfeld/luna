<script lang="ts">
    import { finderMode } from '$lib/stores/archive_store'; 
    import Datatable from './Datatable.svelte';
    import ExecuteFinder from "./ExecuteFinder.svelte";
    export let finderData;
</script>

<ExecuteFinder finderData={finderData}></ExecuteFinder>
<Datatable data={finderData}></Datatable>
