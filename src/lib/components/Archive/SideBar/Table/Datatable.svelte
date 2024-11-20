<script>
	import { DataHandler } from '@vincjo/datatables';
    import Search from './Search.svelte';
    import ThSort from './ThSort.svelte';
    import ThFilter from './ThFilter.svelte';
    import RowsPerPage from './RowsPerPage.svelte';
    import RowCount from './RowCount.svelte';
    import Pagination from './Pagination.svelte';
    export let data;
	//Init data handler - CLIENT
	const handler = new DataHandler(data, { rowsPerPage: 5 });
	const rows = handler.getRows();
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
			<tr>
				<ThFilter {handler} filterBy="id" />
				<ThFilter {handler} filterBy="name" />
				<ThFilter {handler} filterBy="start_date" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td>{row.id}</td>
					<td>{row.name}</td>
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