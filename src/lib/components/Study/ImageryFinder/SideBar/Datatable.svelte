<script lang="ts">
    import Pagination from '$lib/components/Table/Pagination.svelte';
    import RowCount from '$lib/components/Table/RowCount.svelte';
    import RowsPerPage from '$lib/components/Table/RowsPerPage.svelte';
    import Search from '$lib/components/Table/Search.svelte';
    import ThSort from '$lib/components/Table/ThSort.svelte';
import { TableHandler } from '$lib/utils/tableHandler';
	import { featureStore, selectedArchiveResultGeoJson, selectedArchiveResultThumbnail } from '$lib/stores/archive_store';
    import GeoJSON from 'ol/format/GeoJSON';
    import type { Feature } from 'ol';
	let { data } = $props();

	const handler = new TableHandler(data, { rowsPerPage: 10});
	const rows = $derived(handler.rows);

	const unsubscribe = featureStore.subscribe(mapFeatures => {
		const geojsonFormat = new GeoJSON();
		if (mapFeatures){
			const mapStrGeometries = mapFeatures.map((feature: Feature) => {
				const geometry = feature.getGeometry()
				if(!geometry){
					throw new Error('bad geom')
				}
				return geojsonFormat.writeGeometry(geometry); // Returns GeoJSON string
			});
			// @ts-ignore
			const rowFilteredGeometries = data.filter((row) => {
				const geometry = geojsonFormat.readGeometry(row.geometry);
				if(!geometry){
					throw new Error('bad geom')
				}
				const strGeom = geojsonFormat.writeGeometry(geometry);
				return mapStrGeometries.includes(strGeom)
			})			
			handler.setRows(rowFilteredGeometries)
		}
		
    });
	
	// @ts-ignore
    function handleClick(row) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(row.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
		selectedArchiveResultThumbnail.set(row.thumbnail)
	}

	// @ts-ignore
	function handleResetClick() {
		handler.setRows(data)
	}
	
	// @ts-ignore
	function handleHover(row) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(row.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
	}


</script>

<div class="overflow-scroll space-y-4 p-4 ">
	<!-- Header -->
	<header class="flex justify-between gap-4">
		<Search {handler} />
		<!-- <RowsPerPage {handler} /> -->
	</header>
	<!-- Table -->
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				<ThSort {handler} orderBy="id">ID</ThSort>
				<ThSort {handler} orderBy="collection">Collection</ThSort>
				<ThSort {handler} orderBy="sensor">Sensor</ThSort>
				<ThSort {handler} orderBy="start_date">Capture Date</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr 
				onclick={() => handleClick(row)}
				onmouseenter={() => handleHover(row)}
				>
					<td> {row.id}</td>
					<td><i class="fa-solid fa-magnifying-glass"></i> | {row.collection}</td>
					<td>{row.sensor.name}</td>
					<td>{row.start_date}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Footer -->
	<footer class="flex justify-between">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
	<button class="w-full btn variant-filled-primary py-4" onclick={() => handleResetClick()}>RESET MAP FILTER</button>
</div>