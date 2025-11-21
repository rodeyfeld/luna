<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

  interface Props {
		children?: import('svelte').Snippet;
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/providers', label: 'Providers' },
		{ href: '/areas-of-interest', label: 'Areas of Interest' }
	] as const;

	// API docs are proxied through the backend - users don't need direct access
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
				<img src={logo} alt="Luna" class="h-9 w-9 nav-pinwheel" />
				<span class="text-lg">LUNA</span>
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
				<a
					href="https://pinwheel.fan"
					class="rounded-md px-3 py-2 transition-colors text-surface-300 hover:bg-primary-500/90 hover:text-white ml-2"
				>
					◉ <span class="hidden sm:inline">All Projects</span>
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
  {@render children?.()}
	</main>

	<footer class="border-t border-surface-800/60 bg-surface-900/80">
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-surface-400 sm:flex-row sm:items-center sm:justify-between">
			<p>© {year} Pinwheel Labs</p>
		</div>
	</footer>
</div>
