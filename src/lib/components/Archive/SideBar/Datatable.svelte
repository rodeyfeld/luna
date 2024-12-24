<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
    import Search from '../../Table/Search.svelte';
    import ThSort from '../../Table/ThSort.svelte';
    import ThFilter from '../../Table/ThFilter.svelte';
    import RowsPerPage from '../../Table/RowsPerPage.svelte';
    import RowCount from '../../Table/RowCount.svelte';
    import Pagination from '../../Table/Pagination.svelte';
    import GeoJSON from 'ol/format/GeoJSON';
	
    import { selectedFinderGeoJson } from '$lib/stores/archive_store';
	let { data } = $props();
	//Init data handler - CLIENT
	const handler = new DataHandler(data, { rowsPerPage: 10});
	const rows = handler.getRows();

	
	// @ts-ignore
	function handleClick(row) {
		window.location.href = `/archive/finder/${row.id}`

	}


	// @ts-ignore
	function handleHover(row) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(row.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedFinderGeoJson.set(geojson)
	}
	

</script>

<div class=" overflow-x-auto space-y-4">
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
				<ThSort {handler} orderBy="name">Name</ThSort>
				<ThSort {handler} orderBy="start_date">Start Date</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr 
					onclick={() => handleClick(row)}
					onmouseenter={() => handleHover(row)}
				>
					<td> {row.id}</td>
					<td><i class="fa-solid fa-magnifying-glass"></i> | {row.name}</td>
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