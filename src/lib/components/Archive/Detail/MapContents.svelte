<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from 'ol/source/OSM.js';
    import { Vector as VectorLayer } from 'ol/layer.js';
    import { Vector as VectorSource } from 'ol/source.js';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';

    import { Fill, Stroke, Style } from 'ol/style.js';
    import FinderResultHover from './Panel/FinderResultHover.svelte';
    import { selectedArchiveResultGeoJson } from '$lib/stores/archive_store';
    const fill = new Fill({
   color: 'rgba(255,255,255,0.4)',
 });
 const stroke = new Stroke({
   color: '#3399CC',
   width: 1.25,
 });
    export let finderData;
    export let finderResults;
    const features = finderResults.map((finderResult: { geometry: any; }) => {
        const geometry = new GeoJSON().readGeometry(finderResult.geometry);
        return new Feature(geometry)
    })

    const tileLayer = new TileLayer({
        source: new OSM(),
    });
    const vectorSource = new VectorSource({ 
        features: features,
        wrapX: false 
    });

    const featureStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 0, 255, .01)', // Fill color
        }),
        stroke: new Stroke({
            color: '#0000FF', // Stroke color
            width: 2, // Stroke width
        }),
    });

    const selectedFeatureStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 255, 0, .1)', // Fill color
        }),
        stroke: new Stroke({
            color: '#FFFF00', // Stroke color
            width: 4, // Stroke width
        }),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: featureStyle,
    });

    var map: Map;    
    let highlightedFeature: Feature | null = null; // To store the highlighted feature

    onMount(() => {
        map = new Map({
            view: new View({
                center: [0, 0],
                zoom: 1,
                projection: 'EPSG:4326',
            }),
            layers: [tileLayer, vectorLayer],
            target: 'finderMajorMap',
        });

        const geometry = new GeoJSON().readGeometry(finderData.geometry);
        const extent = geometry.getExtent();
        map.getView().fit(extent, { duration: 3000, maxZoom: 6 });
    });

    const unsubscribe = selectedArchiveResultGeoJson.subscribe(value => {
        if (value) {
            // Clear the previously highlighted feature
            if (highlightedFeature) {
                vectorSource.removeFeature(highlightedFeature);
            }

            // Create and add the new highlighted feature
            const geometry = new GeoJSON().readGeometry(value);
            highlightedFeature = new Feature(geometry);
            highlightedFeature.setStyle(selectedFeatureStyle);
            console.log(geometry)
            vectorSource.addFeature(highlightedFeature);
        }
    });

    // Clean up the subscription on component destroy
    onDestroy(() => {
        unsubscribe();
    });

</script>

<style>
    #finderMajorMap {
      height: 100%;
      width: 100%;

    }
  </style>
<div class="w-full h-full grid grid-cols-10 gap-1" >
    <div class="col-span-8">
        <div id="finderMajorMap" class="w-full h-full"></div>
    </div>
    <div class="col-span-2">
        <nav class="list-nav overflow-y-auto max-h-[68vh]">
            <ul>
                {#each finderResults as finderResult}
                <li>
                    <FinderResultHover finderResult={finderResult}></FinderResultHover>
                </li>
                {/each}
            </ul>
        </nav>
    </div>
</div>
  
  