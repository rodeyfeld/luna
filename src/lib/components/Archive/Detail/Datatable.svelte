<script>
	import { DataHandler } from "@vincjo/datatables";
	import Search from "../../Table/Search.svelte";
	import ThSort from "../../Table/ThSort.svelte";
	import RowsPerPage from "../../Table/RowsPerPage.svelte";
	import RowCount from "../../Table/RowCount.svelte";
	import Pagination from "../../Table/Pagination.svelte";
	import Status from "./Status.svelte";

	export let data;

	const handler = new DataHandler(data.studies, { rowsPerPage: 10 });
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
				<ThSort {handler} orderBy="name">Type</ThSort>
				<ThSort {handler} orderBy="start_date"
					>Status</ThSort
				>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td> {row.id}</td>
					<td
						><a
							href="{data.id}/study/{row.study_name}/{row.id}"
							><button
								class="btn bg-tertiary-500"
								><i
									class="fa-solid fa-magnifying-glass"
								></i>
								| {row.study_name}</button
							></a
						></td
					>
					<td><Status data={row}></Status></td>
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
