<script lang="ts">
	export let finders;;
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'

    const handler = new DataHandler(finders, { rowsPerPage: 10 })
    const rows = handler.getRows()
    $: finders, handler.setRows(finders)

</script>

<Datatable handler={handler}>
    <table>
        <thead>
            <tr>
                <Th {handler} orderBy="id">id</Th>
                <Th {handler} orderBy="name">name</Th>
                <Th {handler} orderBy="start_date">start_date</Th>
            </tr>
        </thead>
        <tbody>
            {#each $rows as row}
            <tr>
                <td><a href="/archive/finder/{row.id}">{row.id}</a></td>
                <td>{row.name}</td>
				<td>{row.start_date}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</Datatable>
