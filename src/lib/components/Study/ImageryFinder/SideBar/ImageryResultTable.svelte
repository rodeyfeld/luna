<script lang="ts">
    export let imageryResults;
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'
    import { selectedArchiveResultGeoJson, selectedArchiveResultThumbnail } from '$lib/stores/archive_store';
    import GeoJSON from 'ol/format/GeoJSON';
    
    function handleClick(imageryResult: any) {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(imageryResult.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
		selectedArchiveResultThumbnail.set(imageryResult.thumbnail)
	}

    const handler = new DataHandler(imageryResults, { rowsPerPage: 10 })
    const rows = handler.getRows()
    $: imageryResults, handler.setRows(imageryResults)

</script>

<Datatable handler={handler}>
    <table  class="table table-hover table-compact table-auto w-full ">
        <thead>
            <tr>
                <Th {handler} orderBy="collection"><i class="fa-solid fa-satellite"></i></Th>
                <Th {handler} orderBy="start_date "><i class="fa-solid fa-clock"></i></Th>
                <Th {handler} orderBy="id"><i class="fa-solid fa-hashtag"></i></Th>
            </tr>
        </thead>
        <tbody>
            {#each $rows as row}
            <tr>
                <td>
                    <button on:click={() => handleClick(row)}>
                        <span class="badge bg-primary-500">{row.sensor.name}</span>
                        <span class="flex-auto">{row.collection}</span>
                    </button>
                </td>
                <td>{row.start_date}</td>
                <td>{row.id}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</Datatable>


