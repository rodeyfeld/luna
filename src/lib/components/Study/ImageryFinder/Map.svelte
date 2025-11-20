<script lang="ts">
    import { onMount } from 'svelte';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';
    
    import Overlay from 'ol/Overlay.js';
    import { newBaseFeatureLayer, newHighlightFeatureLayer, highlightFeature, lunaMap, newDrawFeatureLayer, newBaseDraw, newBaseModify, newFilterFeatureLayer, newFilterDraw } from '$lib/components/Map/MapUtils'
    import { Stroke, Style } from 'ol/style';
    import ImageryResultHover from "./SideBar/ImageryResultHover.svelte";
    import Datatable from './SideBar/Datatable.svelte';
    import { featureStore, selectedArchiveResultGeoJson } from "$lib/stores/archive_store";

    let { study } = $props();

    const uniqueGeometries = new Set<string>();
    
    const features = study.study_data.results
    .map((imageryResult: { geometry: any }) => {
        const geometry = new GeoJSON().readGeometry(imageryResult.geometry);
        const coordinates: string = imageryResult.geometry.coordinates.toString();
        return { geometry, coordinates };
    })
    .filter(({ coordinates }) => {
        if (uniqueGeometries.has(coordinates)) {
            return false;
        }
        uniqueGeometries.add(coordinates);
        return true;
    })
    .map(({ geometry }) => new Feature(geometry));

    const baseFeatureLayer = newBaseFeatureLayer(features)
    baseFeatureLayer.setStyle(new Style({
            stroke: new Stroke({
                color: '#5f7b97', 
                width: .5, 
            }),
        })
    )
    const highlightFeatureLayer = newHighlightFeatureLayer()
    const filterFeatureLayer = newFilterFeatureLayer()

    const unsubscribe = selectedArchiveResultGeoJson.subscribe(value => {
        highlightFeature(highlightFeatureLayer, value)
    })

    let map;
    let overlay: Overlay = $state();
    onMount(() => {
        map = lunaMap("map")
        map.addLayer(baseFeatureLayer)
        map.addLayer(highlightFeatureLayer)
        const container = document.querySelector('#image-popup') as HTMLElement;
        overlay = new Overlay({
            element: container,
            autoPan: {
                animation: { duration: 250 },
            },
        });
        map.addOverlay(overlay)
        const geometry = new GeoJSON().readGeometry(study.study_data.imagery_finder_geometry);
        const extent = geometry.getExtent();
        map.getView().fit(extent, {
            duration: 1000, 
            maxZoom: 5,    
        });

        const filterDraw = newFilterDraw(baseFeatureLayer, featureStore)
        map.addInteraction(filterDraw)
    })
</script>

<style>
    #map {
      height: 100%;
      width: 100%;
    }
</style>
<div class="w-full h-full grid grid-cols-10 gap-1" >
    <div class="col-span-5">
        <Datatable data={study.study_data.results}></Datatable>
    </div>
    <div class="col-span-5">
        <div id="map" class="w-full h-full"></div>
    </div>
</div>
<ImageryResultHover overlay={overlay}></ImageryResultHover>


