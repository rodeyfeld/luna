<script lang="ts">
	import type { PageData } from './$types';
    import Map from "$lib/components/Study/ImageryFinder/Map.svelte";
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>
<Map study={data.study}>   
</Map>

