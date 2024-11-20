<script lang="ts">
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';

</script>

<!-- App Rail -->
<AppRail background="bg-transparent" border="border-r">
	<AppRailAnchor selected={$page.url.pathname === '/imagery'} name="imagery" href='/imagery'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-images text-2xl"></i></svelte:fragment>
		<span>IMAGERY</span>
	</AppRailAnchor>
	<hr class="opacity-30" />
	<AppRailAnchor selected={$page.url.pathname.includes('archive')} name="archive" href='/archive/finder'>
		<svelte:fragment slot="lead"><i class="fa-solid fa-photo-film text-2xl"></i></svelte:fragment>
		<span>ARCHIVE</span>
	</AppRailAnchor>
</AppRail>
