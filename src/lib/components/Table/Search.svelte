<script lang="ts">
import type { TableHandler } from '$lib/utils/tableHandler';
	interface Props {
		handler: TableHandler;
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