<script lang="ts">
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';

</script>

<!-- App Rail -->
<AppRail background="bg-transparent" border="border-r border-surface-300" class="animate-fadeIn">
	<AppRailAnchor selected={$page.url.pathname === '/imagery'} name="imagery" href='/imagery' class="transition-smooth hover:scale-105">
		{#snippet lead()}
			<i class="fa-solid fa-images text-2xl"></i>
		{/snippet}
		<span class="text-sm font-semibold">IMAGERY</span>
	</AppRailAnchor>
	<hr class="opacity-30" />
	<AppRailAnchor selected={$page.url.pathname.includes('archive')} name="archive" href='/archive/finder' class="transition-smooth hover:scale-105">
		{#snippet lead()}
			<i class="fa-solid fa-photo-film text-2xl"></i>
		{/snippet}
		<span class="text-sm font-semibold">ARCHIVE</span>
	</AppRailAnchor>
</AppRail>
