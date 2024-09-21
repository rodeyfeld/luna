<script>
    export let images;

    let images_count = images.length;
</script>


<h2>Existing Images</h2>
<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>id</th>
				<th>name</th>
			</tr>
		</thead>
		<tbody>
			{#each images as row, i}
				<tr>
					<td>{row.id}</td>
					<td>{row.name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>