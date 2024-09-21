<script lang="ts">
    import ImagerySideBar from '$lib/components/Imagery/ImagerySideBar.svelte';
    import ImageryShell from '$lib/components/Imagery/ImageryShell.svelte';
    import feasiblity_store from '$lib/stores/feasiblity_store';




</script>


<ImageryShell>
    <svelte:fragment slot="imagerySidebarLeft">
        <ImagerySideBar />
    </svelte:fragment>
    <slot /> 
</ImageryShell>