<script lang="ts">
    
    export let finder_results;
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'

    const handler = new DataHandler(finder_results, { rowsPerPage: 10 })
    const rows = handler.getRows()
    $: finder_results, handler.setRows(finder_results)

</script>

<Datatable {handler}>
    <table>
        <thead>
            <tr>
                <Th {handler} orderBy="archive_finder_id">archive_finder_id</Th>
                <Th {handler} orderBy="external_id">external_id</Th>
                <Th {handler} orderBy="seeker_run_id">seeker_run_id</Th>
                <Th {handler} orderBy="collection">collection</Th>
                <Th {handler} orderBy="start_date">start_date</Th>
                <Th {handler} orderBy="end_date">end_date</Th>
                <Th {handler} orderBy="sensor_type">sensor_type</Th>
                <Th {handler} orderBy="geometry">geometry</Th>
            </tr>
            <!-- <tr>
                <ThFilter {handler} filterBy="id"/>
                <ThFilter {handler} filterBy="start_date" />
                <ThFilter {handler} filterBy="end_date"/>
                <ThFilter {handler} filterBy="provider_integration"/>
            </tr> -->
        </thead>
        <tbody>
            {#each $rows as row}
            <tr>
                <td>{row.archive_finder_id}</td>
                <td>{row.external_id}</td>
                <td>{row.seeker_run_id}</td>
                <td>{row.collection}</td>
                <td>{row.start_date}</td>
                <td>{row.end_date}</td>
                <td>{row.sensor_type}</td>
                <td>{row.geometry}</td>

            </tr>
            {/each}
        </tbody>
    </table>
</Datatable>

<style>
    thead {
        background: #fff;
    }
    tbody td {
        border: 1px solid #f5f5f5;
        padding: 4px 20px;
    }
    tbody tr {
        transition: all, 0.2s;
    }
    tbody tr:hover {
        background: #f5f5f5;
    }
</style>

