<script lang="ts">
    import { onMount } from 'svelte';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';
    import { baseFeatureLayer, newHighlightFeatureLayer, highlightFeature, lunaMap, newDrawFeatureLayer, newBaseDraw, newBaseModify } from '$lib/components/Map/MapUtils'
    import { createFinderGeoJson, selectedFinderGeoJson } from '$lib/stores/archive_store';

    export let finders;
    

    const features = finders.map((finderResult: { geometry: any; }) => {
        const geometry = new GeoJSON().readGeometry(finderResult.geometry);
        return new Feature(geometry)
    })
    const highlightFeatureLayer = newHighlightFeatureLayer()
    
    const drawFeatureLayer = newDrawFeatureLayer()
    
    const unsubscribe = selectedFinderGeoJson.subscribe(value => {
        highlightFeature(highlightFeatureLayer, value)
    })

    let map;
    onMount(() => {
        map = lunaMap("archiveFinderMap")
        map.addLayer(baseFeatureLayer(features))
        map.addLayer(highlightFeatureLayer)
        map.addLayer(drawFeatureLayer)

        const drawInteraction = newBaseDraw(drawFeatureLayer, createFinderGeoJson)
        const modifyInteraction = newBaseModify(drawFeatureLayer, createFinderGeoJson)
        map.addInteraction(drawInteraction)
        map.addInteraction(modifyInteraction)

    })


</script>

<style>
    #archiveFinderMap {
      height: 100%;
      width: 100%;
    }
</style>

<div id="archiveFinderMap" class="w-full h-full"></div>

