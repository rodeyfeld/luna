<script lang="ts">
    import CreateFinder from '$lib/components/Feasibility/CreateFinder.svelte';
    import ListFinders from '$lib/components/Feasibility/ListFinders.svelte';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import type { PageData } from './$types'
    import FinderResult from '$lib/components/Feasibility/FinderResult.svelte';
    import { getContext } from 'svelte';
    let tabSet: number = 0;
    export let data: PageData;
    const selectedFinder = getContext('finder'); 
    import Map from '$lib/components/Map/Map.svelte';

    let currentFinder: string = "";
    // let finderContent = [];
	// async function updateFinderContent() {

    //     console.log("HERFE")
	// 	const response = await fetch(`/api/feasibility/finder_results/${currentFinder}`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'content-type': 'application/json',
	// 		},
	// 	});

    //     finderContent = await response.json()
    // }
	


</script>

<Map></Map>