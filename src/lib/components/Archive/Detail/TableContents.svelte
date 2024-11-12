<script lang="ts">
    
    export let finderData;
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'

    const handler = new DataHandler(finderData.studies, { rowsPerPage: 10 })
    const rows = handler.getRows()
    $: finderData.studies, handler.setRows(finderData.studies)

</script>

<Datatable handler={handler}>
    <table>
        <thead>
            <tr>
                <Th {handler} orderBy="id">id</Th>
                <Th {handler} orderBy="study_name">study</Th>
                <Th {handler} orderBy="status">status</Th>
            </tr>
        </thead>
        <tbody>
            {#each $rows as row}
            <tr>
                
                <td>{row.id}</td>

                <td>{row.study_name}</td>

                <td>{row.status}</td>
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

