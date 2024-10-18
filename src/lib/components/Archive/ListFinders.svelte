<script lang="ts">
	export let finders;
</script>


<h2>Existing Finders</h2>
<div>
	<ul>
		{#each finders as finder, i}
		<li>
			<a href="/archive/finder/{finder.id}">
				<span class="badge bg-primary-500">{finder.status}</span>
				<span class="flex-auto">Finder {finder.id}:</span>
				<span class="flex-auto"> {finder.name} </span>
			</a>
		</li>
		{/each}
	</ul>
</div>