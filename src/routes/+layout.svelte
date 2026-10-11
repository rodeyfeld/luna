<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { ArrowUpRight } from '@lucide/svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const navLinks = [
		{ href: '/areas-of-interest', label: 'Areas' },
		{ href: '/dashboard', label: 'Finders' },
		{ href: '/providers', label: 'Sources' }
	] as const;

	const year = new Date().getFullYear();

	function isActive(currentPath: string, href: string) {
		if (href === '/dashboard') return currentPath.startsWith('/dashboard') || currentPath.startsWith('/archive');
		return currentPath.startsWith(href);
	}
</script>

<svelte:head>
	<title>luna</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-night text-moon">
	<header class="sticky top-0 z-40 border-b border-line bg-night">
		<div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
			<a href="/" class="group flex items-center gap-3">
				<img src="/pinwheel.svg" alt="" class="nav-pinwheel h-7 w-7 opacity-90" />
				<span class="font-display text-[1.7rem] leading-none text-moon">luna</span>
			</a>

			<nav class="flex items-center gap-1 overflow-x-auto text-sm">
				{#each navLinks as link}
					{@const active = isActive($page.url.pathname, link.href)}
					<a
						href={link.href}
						aria-current={active ? 'page' : undefined}
						class="relative flex h-16 items-center px-3 transition-colors {active
							? 'text-moon'
							: 'text-haze hover:text-moon'}"
					>
						{link.label}
						{#if active}
							<span class="absolute inset-x-3 -bottom-px h-px bg-sodium"></span>
						{/if}
					</a>
				{/each}
				<span class="mx-2 hidden h-4 w-px bg-line-strong sm:block"></span>
				<a
					href="https://pinwheel.fan"
					class="flex h-16 items-center gap-1 px-3 whitespace-nowrap text-haze transition-colors hover:text-moon"
				>
					<span class="hidden sm:inline">All projects</span>
					<span class="sm:hidden">All</span>
					<ArrowUpRight size={14} strokeWidth={1.5} />
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
		{@render children?.()}
	</main>

	<footer class="border-t border-line">
		<div
			class="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6"
		>
			<p class="readout text-xs text-haze">© {year} Pinwheel Labs</p>
			<p class="eyebrow text-shade">luna · observing the public archive</p>
		</div>
	</footer>
</div>
