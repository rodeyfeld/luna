<script lang="ts">
    import { onMount } from 'svelte';
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from 'ol/source/OSM.js';
    import { Vector as VectorLayer } from 'ol/layer.js';
    import { Vector as VectorSource } from 'ol/source.js';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';
    import { transformExtent } from 'ol/proj';
    import { boundingExtent } from 'ol/extent';

    import {Circle, Fill, Stroke, Style} from 'ol/style.js';
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

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: featureStyle,
    });

    var map: Map;
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
        map.getView().fit(extent, {
            duration: 3000, 
            maxZoom: 7,    
        });
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
            <!-- (optionally you can provide a label here) -->
            <ul>
                {#each finderResults as finderResult}
                <li>
                    
                        <span class="badge bg-primary-500">{finderResult.sensor_type}</span>
                        <span class="flex-auto">{finderResult.collection}</span>
             
                </li>
                {/each}
                <!-- ... -->
            </ul>
        </nav>
    </div>
</div>
  
  