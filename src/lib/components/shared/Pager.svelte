<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface Props {
		page: number;
		totalPages: number;
		start: number;
		end: number;
		total: number;
		onchange: (page: number) => void;
	}

	let { page, totalPages, start, end, total, onchange }: Props = $props();

	const pages = $derived.by(() => {
		const out: (number | '…')[] = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) out.push(i);
			return out;
		}
		let lo = Math.max(2, page - 1);
		let hi = Math.min(totalPages - 1, page + 1);
		if (page <= 3) hi = 4;
		if (page >= totalPages - 2) lo = totalPages - 3;
		out.push(1);
		if (lo > 2) out.push('…');
		for (let i = lo; i <= hi; i++) out.push(i);
		if (hi < totalPages - 1) out.push('…');
		out.push(totalPages);
		return out;
	});
</script>

<div class="flex items-center justify-between gap-4 border-t border-line px-1 pt-4">
	<p class="readout text-xs text-haze">
		{start}–{end} <span class="text-shade">of</span> {total}
	</p>
	<div class="flex items-center gap-1">
		<button
			class="btn btn-sm btn-quiet btn-icon"
			disabled={page === 1}
			onclick={() => onchange(page - 1)}
			aria-label="Previous page"
		>
			<ChevronLeft size={14} />
		</button>
		{#each pages as p}
			{#if p === '…'}
				<span class="readout px-1 text-xs text-shade">…</span>
			{:else}
				<button
					class="btn btn-sm btn-icon {p === page ? '' : 'btn-quiet'}"
					aria-current={p === page ? 'page' : undefined}
					onclick={() => onchange(p)}
				>
					{p}
				</button>
			{/if}
		{/each}
		<button
			class="btn btn-sm btn-quiet btn-icon"
			disabled={page === totalPages}
			onclick={() => onchange(page + 1)}
			aria-label="Next page"
		>
			<ChevronRight size={14} />
		</button>
	</div>
</div>
