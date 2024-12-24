<script lang="ts">
    import Datatable from "./Datatable.svelte";

	let { finders } = $props();
</script>


<Datatable data={finders}></Datatable>