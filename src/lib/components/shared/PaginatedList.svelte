<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import EmptyState from './EmptyState.svelte';
	import Pager from './Pager.svelte';

	interface Props {
		items: T[];
		itemsPerPage?: number;
		children: Snippet<[T]>;
		emptyTitle?: string;
		emptyMessage?: string;
		emptyAction?: Snippet;
	}

	let {
		items = [],
		itemsPerPage = 10,
		children,
		emptyTitle = 'Nothing here yet',
		emptyMessage,
		emptyAction
	}: Props = $props();

	let currentPage = $state(1);

	const totalPages = $derived(Math.ceil(items.length / itemsPerPage));
	const startIndex = $derived((currentPage - 1) * itemsPerPage);
	const endIndex = $derived(Math.min(startIndex + itemsPerPage, items.length));
	const paginatedItems = $derived(items.slice(startIndex, endIndex));

	// Reset to page 1 when items shrink below the current page
	$effect(() => {
		if (items.length > 0 && currentPage > totalPages) {
			currentPage = 1;
		}
	});
</script>

{#if items.length === 0}
	<EmptyState title={emptyTitle} description={emptyMessage} action={emptyAction} />
{:else}
	<div>
		<div>
			{#each paginatedItems as item}
				{@render children(item)}
			{/each}
		</div>

		{#if totalPages > 1}
			<Pager
				page={currentPage}
				{totalPages}
				start={startIndex + 1}
				end={endIndex}
				total={items.length}
				onchange={(p) => (currentPage = p)}
			/>
		{/if}
	</div>
{/if}
