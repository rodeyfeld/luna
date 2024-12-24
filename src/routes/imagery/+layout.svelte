<script lang="ts">
    import ImagerySideBar from '$lib/components/Imagery/ImagerySideBar.svelte';
    import ImageryShell from '$lib/components/Imagery/ImageryShell.svelte';
	import type { LayoutData } from './$types';
    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();
</script>


<ImageryShell>
    {#snippet imagerySidebarLeft()}
    
            <ImagerySideBar images={data.images}  />
        
    {/snippet}
    {@render children?.()} 
</ImageryShell>