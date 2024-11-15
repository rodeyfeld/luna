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
    <table>
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

<style>
    thead {
        background: #2c3e50;
    }
    tbody td {
        border: 1px solid #2c3e50;
        padding: 4px 20px;
    }
    tbody tr {
        transition: all, 0.2s;
    }
    tbody tr:hover {
        background: #a9cce3;
    }
</style>

