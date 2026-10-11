<script lang="ts">
	import type { Snippet } from 'svelte';
	import MoonPhase from './MoonPhase.svelte';

	interface Props {
		title: string;
		description?: string;
		action?: Snippet;
	}

	let { title, description, action }: Props = $props();
</script>

<div class="flex flex-col items-center px-4 py-14 text-center">
	<MoonPhase phase="new" size={36} class="mb-5 text-shade" />
	<h3 class="font-display text-2xl text-moon">{title}</h3>
	{#if description}
		<p class="mx-auto mt-2 mb-6 max-w-md text-sm text-haze">{description}</p>
	{/if}
	{#if action}
		{@render action()}
	{/if}
</div>
