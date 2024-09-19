<script lang="ts">
    // import { DataHandler } from '@vincjo/datatables'
    // let results;

    import ExecuteFinder from "./FeasibilityResultPanel/ExecuteFinder.svelte";

    export let finder;

    // const handler = new DataHandler(results, { rowsPerPage: 50 })
    // const rows = handler.getRows()
</script>
<ExecuteFinder finder={finder}></ExecuteFinder>
<!-- <table>
    <thead>
        <tr>
            <th>First name</th>
            <th>Last name</th>
        </tr>
    </thead>
    <tbody>
        {#each $rows as row}
            <tr>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
            </tr>
        {/each}
    </tbody>
</table> -->
