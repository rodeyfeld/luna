<script lang="ts">
	export type SectionVariant = 'default' | 'hero' | 'muted';

	export let variant: SectionVariant = 'default';
	export let padding = 'px-4 sm:px-8 py-12';
	export let tag: keyof HTMLElementTagNameMap = 'section';
	export let className = '';

	const variantClassMap: Record<SectionVariant, string> = {
		default: '',
		hero: 'section-hero',
		muted: 'section-muted'
	};
</script>

<svelte:element
	this={tag}
	class={`section-panel w-full ${variantClassMap[variant]} ${padding} ${className}`.trim()}
	{...$$restProps}
>
	<slot />
</svelte:element>

