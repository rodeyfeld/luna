<script lang="ts">
	import { AppBar, popup } from "@skeletonlabs/skeleton";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	import LunaLogo from "$lib/components/Luna/LunaLogos/LunaLogo.svelte";
	const breadcrumbs = derived(page, ($page) => {
		const segments = $page.url.pathname.split("/"); // Filter out empty segments
		return segments.map((slug, index) => {
			const href = segments.slice(0, index + 1).join("/");
			return {
				label: slug,
				href: href,
			};
		});
	});
</script>

<AppBar shadow="shadow-2xl" slotTrail="!space-x-2" class="backdrop-blur-sm bg-opacity-95 sticky top-0 z-50 animate-fadeIn border-b border-surface-300">
	{#snippet lead()}
		<div class="grid grid-cols-2 md:grid-cols-[auto_1fr]">
			<a href="/" class="transition-smooth hover:scale-105">
				<div class="flex items-center space-x-4">
					<LunaLogo></LunaLogo>
					<span class="font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">LUNA</span>
				</div>
			</a>
		</div>
		<div>
			<ol class="breadcrumb">
				{#each $breadcrumbs as slugPath, i}
					<!-- If crumb index is less than the breadcrumb length minus 1 -->
					{#if i < $breadcrumbs.length - 1}
						<li class="crumb">
							<a
								class="anchor"
								href={slugPath.href}
								>{slugPath.label}</a
							>
						</li>
						<li class="crumb-separator">
							&rsaquo;
						</li>
					{:else}
						<li class="crumb">
							{slugPath.label}
						</li>
					{/if}
				{/each}
			</ol>
		</div>
	{/snippet}
	{#snippet trail()}
		<!-- Explore -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{
					event: "click",
					target: "features",
				}}
			>
				<span>Extras</span>
				<i class="fa-solid fa-caret-down opacity-50"
				></i>
			</button>
			<!-- popup -->
			<div
				class="card p-4 w-60 shadow-xl"
				data-popup="features"
			>
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/">
								<span
									class="w-6 text-center"
									><i
										class="fa-solid fa-home"

									></i></span
								>
								<span
									>Homepage</span
								>
							</a>
						</li>
						<li>
							<a href="/#">
								<span
									class="w-6 text-center"
									><i
										class="fa-solid fa-book"

									></i></span
								>
								<span
									>Documentation</span
								>
							</a>
						</li>
						<li>
							<a href="/#">
								<span
									class="w-6 text-center"
									><i
										class="fa-solid fa-bullhorn"

									></i></span
								>
								<span
									>Providers</span
								>
							</a>
						</li>
						<hr class="!my-3" />
						<li>
							<a href="/#">
								<span
									>Configuration</span
								>
							</a>
						</li>
						<li>
							<a href="/#">
								<span
									>Satellites</span
								>
							</a>
						</li>
						<li>
							<a href="/#">
								<span
									class="w-6 text-center"
									><i
										class="fa-solid fa-screwdriver-wrench"

									></i></span
								>
								<span
									>Utilities</span
								>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	{/snippet}
</AppBar>

