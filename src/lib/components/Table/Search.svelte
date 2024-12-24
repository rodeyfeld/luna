<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	interface Props {
		handler: DataHandler;
	}

	let { handler }: Props = $props();
	let value: string = $state();
</script>

<input
	class="input"
	type="search"
	placeholder="Search..."
	bind:value
	oninput={() => handler.search(value)}
/>