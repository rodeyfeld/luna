<script lang="ts">
import type { TableHandler } from '$lib/utils/tableHandler';
	interface Props {
		handler: TableHandler;
		filterBy: string;
	}

	let { handler, filterBy }: Props = $props();
	let value: string = $state();
</script>

<th>
	<input
		class="input text-sm w-full"
		type="text"
		placeholder="Filter"
		bind:value
		oninput={() => {
			if (filterBy) handler.filter(value, filterBy);
		}}
	/>
</th>