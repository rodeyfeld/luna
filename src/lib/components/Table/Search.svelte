<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	let value: string;
</script>

<input
	class="input"
	type="search"
	placeholder="Search..."
	bind:value
	on:input={() => handler.search(value)}
/>