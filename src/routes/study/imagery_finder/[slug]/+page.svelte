<script lang="ts">
	import type { PageData } from './$types';
    import ImageryFinderMap from '$lib/components/Study/ImageryFinder/ImageryFinderMap.svelte';
    export let data: PageData;
</script>
<!-- {data.studyResults.study_data} -->
<ImageryFinderMap studyData={data.studyResults.study_data}></ImageryFinderMap>

