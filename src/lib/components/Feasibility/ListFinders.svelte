<script lang="ts">
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";


	export let finderValue = '';
	export let finders;

</script>


<h2>Existing Finders</h2>
<div>
	<ListBox>
		{#each finders as finder, i}
			<ListBoxItem 
				bind:group={finderValue}
				name="finder" 
				value="{finder.id}">{finder.id} | {finder.status}
			</ListBoxItem>
		{/each}
	</ListBox>
</div>