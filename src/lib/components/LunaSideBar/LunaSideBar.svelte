<script lang="ts">
	import { page } from '$app/stores';

	// import DocsIcon from '$lib/components/DocsIcon/DocsIcon.svelte';
	import { menuNavLinks } from '$lib/links';
	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import CreateImagery from '../Imagery/CreateImagery.svelte';
    import ListImagery from '../Imagery/ListImagery.svelte';

	// Local
	let currentRailCategory: keyof typeof menuNavLinks | undefined = undefined;
	const drawerStore = getDrawerStore();

	function onClickAnchor(): void {
		currentRailCategory = undefined;
		drawerStore.close();
	}

	// Lifecycle
	page.subscribe((page) => {
		// ex: /basePath/...
		let basePath: string = page.url.pathname.split('/')[1];
		if (!basePath) return;
		// Translate base path to link section
		if (['docs', 'essentials', 'resources', 'integrations'].includes(basePath)) currentRailCategory = '/docs';
		if (['tokens', 'base', 'elements', 'blocks'].includes(basePath)) currentRailCategory = '/elements';
		if (['components', 'actions'].includes(basePath)) currentRailCategory = '/svelte';
		if (['utilities'].includes(basePath)) currentRailCategory = '/utilities';
	});
let tabSet: number = 0;

	// Reactive
	$: submenu = menuNavLinks[currentRailCategory ?? '/docs'];
	$: listboxItemActive = (href: string) => ($page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '');
</script>

<div class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ?? ''}">
	<!-- App Rail -->
	<AppRail background="bg-transparent" border="border-r border-surface-500/30">
		<AppRailTile bind:group={currentRailCategory} name="imagery" value={'/imagery'}>
			<svelte:fragment slot="lead"><i class="fa-solid fa-book text-2xl"></i></svelte:fragment>
			<span>IMAGERY</span>
		</AppRailTile>
		<hr class="opacity-30" />
		<AppRailTile bind:group={currentRailCategory} name="utilities" value={'/orders'}>
			<svelte:fragment slot="lead"><i class="fa-solid fa-screwdriver-wrench text-2xl"></i></svelte:fragment>
			<span>ORDERS</span>
		</AppRailTile>
	</AppRail>
	<section class="p-4 pb-20 space-y-4 overflow-y-auto">
		<TabGroup>
			<Tab bind:group={tabSet} name="tab1" value={0}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>CREATE</span>
			</Tab>
			<Tab bind:group={tabSet} name="tab2" value={1}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>VIEW</span>

			</Tab>
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<CreateImagery></CreateImagery>
				{:else if tabSet === 1}
					<ListImagery></ListImagery>
				{/if}
			</svelte:fragment>
		</TabGroup>

	</section>
</div>