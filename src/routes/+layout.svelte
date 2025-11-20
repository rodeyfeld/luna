<script lang="ts">
	import '../app.css';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/stores';

	interface Props {
		children?: import('svelte').Snippet;
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/providers', label: 'Providers' },
		{ href: '/archive/create', label: 'New Search' }
	] as const;

	const apiBase = env.PUBLIC_AUGUR_URL || 'http://localhost:8000';
	const apiDocsUrl = `${apiBase}/api/docs`;
	const logo = '/pinwheel.svg';
	const year = new Date().getFullYear();

	function isActive(currentPath: string, href: string) {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	let { children }: Props = $props();
</script>

<div class="min-h-screen bg-surface-950 text-surface-50">
	<header class="border-b border-surface-800/60 bg-surface-900/80 backdrop-blur">
		<div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
			<a href="/" class="flex items-center gap-3 font-semibold tracking-wide">
				<img src={logo} alt="Luna" class="h-9 w-9" />
				<span class="text-lg">Luna · Augur Frontend</span>
			</a>
			<nav class="flex flex-wrap items-center gap-1 text-sm font-medium">
				{#each navLinks as link}
					<a
						href={link.href}
						class={`rounded-md px-3 py-2 transition-colors ${
							isActive($page.url.pathname, link.href)
								? 'bg-primary-500/90 text-white'
								: 'text-surface-300 hover:bg-surface-800 hover:text-white'
						}`}
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<div class="flex items-center gap-2">
				<a
					href={apiDocsUrl}
					target="_blank"
					rel="noreferrer"
					class="btn btn-sm variant-soft"
				>
					API Docs
				</a>
			</div>
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
		{@render children?.()}
	</main>

	<footer class="border-t border-surface-800/60 bg-surface-900/80">
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-surface-400 sm:flex-row sm:items-center sm:justify-between">
			<p>© {year} Augur Geospatial · {apiBase}</p>
			<p class="text-xs">
				Simple SvelteKit frontend powered by Skeleton + Tailwind&nbsp;4
			</p>
		</div>
	</footer>
</div>
