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
                <Th {handler} orderBy="id">id</Th>
                <Th {handler} orderBy="created">created</Th>
                <Th {handler} orderBy="modified">modified</Th>
                <Th {handler} orderBy="provider_integration">provider_integration</Th>
                <Th {handler} orderBy="start_date">start_date</Th>
                <Th {handler} orderBy="end_date">end_date</Th>
                <Th {handler} orderBy="confidence_score">confidence_score</Th>
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
                <td>{row.id}</td>
                <td>{row.created}</td>
                <td>{row.modified}</td>
                <td>{row.provider_integration}</td>
                <td>{row.start_date}</td>
                <td>{row.end_date}</td>
                <td>{row.confidence_score}</td>
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


<table>
    <thead>
        <tr>
        </tr>
    </thead>
    <tbody>
        {#each $rows as row}
            <tr>
                <td>{row.id}</td>
                <td>{row.created}</td>
                <td>{row.modified}</td>
                <td>{row.feasibility_finder}</td>
                <td>{row.provider_integration}</td>
                <td>{row.start_date}</td>
                <td>{row.end_date}</td>
                <td>{row.confidence_score}</td>
            </tr>
        {/each}
    </tbody>
</table>