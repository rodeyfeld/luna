<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		padding?: string;
		tag?: keyof HTMLElementTagNameMap;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { padding = 'p-5 sm:p-6', tag = 'section', class: className = '', children, ...rest }: Props =
		$props();
</script>

<svelte:element this={tag} class="panel w-full {padding} {className}" {...rest}>
	{@render children?.()}
</svelte:element>
