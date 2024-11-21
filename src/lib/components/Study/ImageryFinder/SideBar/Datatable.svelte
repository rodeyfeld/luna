<script>
    import Pagination from '$lib/components/Table/Pagination.svelte';
    import RowCount from '$lib/components/Table/RowCount.svelte';
    import RowsPerPage from '$lib/components/Table/RowsPerPage.svelte';
    import Search from '$lib/components/Table/Search.svelte';
    import ThSort from '$lib/components/Table/ThSort.svelte';
	import { DataHandler } from '@vincjo/datatables';
	import { selectedArchiveResultGeoJson, selectedArchiveResultThumbnail } from '$lib/stores/archive_store';
    import GeoJSON from 'ol/format/GeoJSON';
    export let data;

	const handler = new DataHandler(data, { rowsPerPage: 10});
	const rows = handler.getRows();

	
	
	// @ts-ignore
    function handleClick(row) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(row.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
		selectedArchiveResultThumbnail.set(row.thumbnail)
	}

	// @ts-ignore
	function handleHover(row) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(row.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
	}


</script>

<div class="overflow-scroll space-y-4">
	<!-- Header -->
	<header class="flex justify-between gap-4">
		<Search {handler} />
		<RowsPerPage {handler} />
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
				on:click={() => handleClick(row)}
				on:mouseenter={() => handleHover(row)}
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
</div>