<script lang="ts">
	import type { PageData } from './$types';
    import Map from "$lib/components/Study/ImageryFinder/Map.svelte";
    export let data: PageData;
</script>
<Map study={data.study}>   
</Map>

