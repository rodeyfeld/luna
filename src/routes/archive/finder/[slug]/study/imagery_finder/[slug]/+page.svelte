<script lang="ts">
	import type { PageData } from './$types';
    import Map from "$lib/components/Study/ImageryFinder/Map.svelte";
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>
<div class="lg:h-[calc(100vh-10rem)] lg:min-h-[520px]">
    <Map study={data.study}></Map>
</div>

