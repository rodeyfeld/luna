<script lang="ts">
	export let label = '';
	export let value: string | number = '';
	export let hint: string | null = null;
	export let icon: string | null = null;
	export let accent = false;
</script>

<div class={`stat-card ${accent ? 'stat-card--accent' : ''}`} data-variant={accent ? 'accent' : undefined}>
	<p class="text-sm text-surface-600-300-token">{label}</p>
	<div class="flex items-baseline gap-2">
		<p class="text-3xl font-bold">{value}</p>
		{#if icon}
			<span class="text-2xl opacity-60">{icon}</span>
		{/if}
	</div>
	{#if hint}
		<span class="text-sm text-surface-600-300-token">{hint}</span>
	{/if}
	<slot />
</div>

