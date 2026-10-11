<script lang="ts">
	import type { Phase } from '$lib/utils/status';

	interface Props {
		phase: Phase;
		size?: number;
		class?: string;
	}

	let { phase, size = 14, class: className = '' }: Props = $props();

	const R = 6.5;
	const C = 8;

	const lit: Record<Phase, number> = {
		new: 0,
		crescent: 0.22,
		half: 0.5,
		gibbous: 0.78,
		full: 1,
		eclipse: 0
	};

	// Lit limb on the right (waxing). The terminator is a half-ellipse whose
	// width shrinks to zero at first quarter and flips side past it.
	const path = $derived.by(() => {
		const f = lit[phase];
		if (f <= 0 || f >= 1) return '';
		const rx = R * Math.abs(1 - 2 * f);
		const sweep = f < 0.5 ? 0 : 1;
		return `M ${C} ${C - R} A ${R} ${R} 0 0 1 ${C} ${C + R} A ${rx} ${R} 0 0 ${sweep} ${C} ${C - R} Z`;
	});
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 16 16"
	class="shrink-0 {className}"
	aria-hidden="true"
>
	{#if phase === 'full'}
		<circle cx={C} cy={C} r={R} fill="currentColor" />
	{:else if phase === 'eclipse'}
		<circle cx={C} cy={C} r={R} fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.25" />
		<circle cx={C - 1.6} cy={C - 1.2} r={R - 1.2} style="fill: var(--color-night)" />
	{:else}
		<circle cx={C} cy={C} r={R} fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1" />
		{#if path}
			<path d={path} fill="currentColor" />
		{/if}
	{/if}
</svg>
