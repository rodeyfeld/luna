<script lang="ts">
	export let finders;
</script>


<h2>Existing Finders</h2>
<div>
	<ul>
		{#each finders as finder, i}
		<li>
			<a href="/feasibility/finder/{finder.id}">
				<!-- <span class="badge bg-primary-500">(icon)</span> -->
				<span class="flex-auto">{finder.id} | {finder.status}</span>
			</a>
		</li>
		{/each}
	</ul>
</div>