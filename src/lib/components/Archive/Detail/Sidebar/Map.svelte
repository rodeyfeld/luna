<script lang="ts">
    import { onMount } from 'svelte';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';
    import { newBaseFeatureLayer, lunaMap, lunaLockedMap } from '$lib/components/Map/MapUtils'
    
  let { finderData } = $props();
    const geometry = new GeoJSON().readGeometry(finderData.geometry);
    const feature = new Feature({
        geometry: geometry,
    });
    
    const baseFeatureLayer = newBaseFeatureLayer([feature])
    let map;
    onMount(() => {
        map = lunaLockedMap("archiveFinderMiniMap")
        map.addLayer(baseFeatureLayer)
        const extent = geometry.getExtent();
        map.getView().fit(extent, {
            duration: 1000, 
            maxZoom: 5,    
        });
    })    
</script>


<style>
    #archiveFinderMiniMap {
      height: 48vh;
      width: 100%;
    }
  </style>
  <div id="archiveFinderMiniMap" class="w-full h-full"></div>
  