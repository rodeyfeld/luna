<script lang="ts">
    import ImagerySideBar from '$lib/components/Imagery/ImagerySideBar.svelte';
    import ImageryShell from '$lib/components/Imagery/ImageryShell.svelte';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>


<ImageryShell>
    <svelte:fragment slot="imagerySidebarLeft">
        <ImagerySideBar images={data.images}  />
    </svelte:fragment>
    <slot /> 
</ImageryShell>