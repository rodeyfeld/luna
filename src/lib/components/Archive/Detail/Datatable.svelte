<script lang="ts">
	import { TableHandler } from '$lib/utils/tableHandler';
	import Search from "../../Table/Search.svelte";
	import ThSort from "../../Table/ThSort.svelte";
	import RowsPerPage from "../../Table/RowsPerPage.svelte";
	import RowCount from "../../Table/RowCount.svelte";
	import Pagination from "../../Table/Pagination.svelte";
	import Status from "./Status.svelte";

	let { data } = $props();

	const handler = new TableHandler(data.studies, { rowsPerPage: 10 });
	const rows = $derived(handler.rows);
</script>

<div class="overflow-x-auto space-y-4 animate-fadeIn">
	<!-- Header -->
	<header class="flex justify-between gap-4 p-4 bg-surface-100 rounded-lg">
		<Search {handler} />
		<RowsPerPage {handler} />
	</header>
	<!-- Table -->
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr class="bg-surface-200">
				<ThSort {handler} orderBy="id">ID</ThSort>
				<ThSort {handler} orderBy="name">Type</ThSort>
				<ThSort {handler} orderBy="start_date">Status</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr class="hover-lift transition-smooth hover:bg-surface-100">
					<td class="font-mono">{row.id}</td>
					<td>
						<a href="{data.id}/study/{row.study_name}/{row.id}">
							<button class="btn variant-filled-tertiary transition-smooth hover:scale-105 hover:shadow-lg">
								<i class="fa-solid fa-magnifying-glass mr-2"></i>
								{row.study_name}
							</button>
						</a>
					</td>
					<td><Status data={row}></Status></td>
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Footer -->
	<footer class="flex justify-between p-4 bg-surface-100 rounded-lg">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
</div>
