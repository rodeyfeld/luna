<script lang="ts">
    import { onMount } from 'svelte';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';
    import { newBaseFeatureLayer, newHighlightFeatureLayer, highlightFeature, lunaMap, newDrawFeatureLayer, newBaseDraw, newBaseModify } from '$lib/components/Map/MapUtils'
    import { createFinderGeoJson, selectedFinderGeoJson } from '$lib/stores/archive_store';
    import { boundingExtent } from 'ol/extent';

    let { finders } = $props();
    

    const features = finders.map((finderResult: { geometry: any; }) => {
        const geometry = new GeoJSON().readGeometry(finderResult.geometry);
        return new Feature(geometry)
    })

    const baseFeatureLayer = newBaseFeatureLayer(features)
    const highlightFeatureLayer = newHighlightFeatureLayer()
    const drawFeatureLayer = newDrawFeatureLayer()
    
    const unsubscribe = selectedFinderGeoJson.subscribe(value => {
        highlightFeature(highlightFeatureLayer, value)
    })

    let map;
    onMount(() => {
        map = lunaMap("imageryFinderMap")
        map.addLayer(baseFeatureLayer)
        map.addLayer(highlightFeatureLayer)
        map.addLayer(drawFeatureLayer)

        const drawInteraction = newBaseDraw(drawFeatureLayer, createFinderGeoJson)
        const modifyInteraction = newBaseModify(drawFeatureLayer, createFinderGeoJson)
        map.addInteraction(drawInteraction)
        map.addInteraction(modifyInteraction)

        // Zoom to fit all features (automatically adjusts based on size)
        // Small delay to ensure map is fully rendered
        setTimeout(() => {
            if (features.length > 0) {
                const source = baseFeatureLayer.getSource();
                if (source) {
                    const extent = source.getExtent();
                    map.getView().fit(extent, {
                        padding: [80, 80, 80, 80],
                        duration: 500
                    });
                }
            }
        }, 100);
    })


</script>

<style>
    #imageryFinderMap {
      height: 100%;
      width: 100%;
    }
</style>

<div id="imageryFinderMap" class="w-full h-full"></div>

