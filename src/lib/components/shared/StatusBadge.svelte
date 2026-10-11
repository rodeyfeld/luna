<script lang="ts">
	import MoonPhase from './MoonPhase.svelte';
	import { statusInfo } from '$lib/utils/status';

	interface Props {
		status: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { status, size = 'md' }: Props = $props();

	const info = $derived(statusInfo(status));
	const glyph = $derived({ sm: 11, md: 13, lg: 16 }[size]);
	const text = $derived({ sm: 'text-[0.62rem]', md: 'text-[0.68rem]', lg: 'text-xs' }[size]);
</script>

<span class="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em] {text} {info.tone}">
	<MoonPhase phase={info.phase} size={glyph} class={info.live ? 'animate-wax' : ''} />
	<span>{info.label}</span>
</span>
