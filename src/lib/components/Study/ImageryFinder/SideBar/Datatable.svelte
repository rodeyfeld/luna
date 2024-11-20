<script>
    import Pagination from '$lib/components/Table/Pagination.svelte';
    import RowCount from '$lib/components/Table/RowCount.svelte';
    import RowsPerPage from '$lib/components/Table/RowsPerPage.svelte';
    import Search from '$lib/components/Table/Search.svelte';
    import ThSort from '$lib/components/Table/ThSort.svelte';
	import { DataHandler } from '@vincjo/datatables';
	
    export let data;

	const handler = new DataHandler(data, { rowsPerPage: 10});
	const rows = handler.getRows();

	
	// @ts-ignore


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
				<ThSort {handler} orderBy="name">Type</ThSort>
				<ThSort {handler} orderBy="start_date">Status</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td> {row.id}</td>
					<td><i class="fa-solid fa-magnifying-glass"></i> | {row.study_name}</td>
					<td>{row.status}</td>
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