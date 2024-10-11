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


    export let finderData;
    export let finderResults;
    const geometry = new GeoJSON().readGeometry(finderData.geometry);
    const feature = new Feature({
        geometry: geometry,
    });

    const tileLayer = new TileLayer({
        source: new OSM(),
    });
    const vectorSource = new VectorSource({ 

        features: [feature],
        wrapX: false 
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    var map: Map;
    onMount(() => {
        map = new Map({
        view: new View({
            center: [0, 0],
            zoom: 1,
        }),
        layers: [tileLayer, vectorLayer],
        target: 'finderMajorMap',
        });
        const extent = geometry.getExtent();
        const transformedExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
        console.log(extent)
        // Fit the map view to the extent of the geometry
        map.getView().fit(transformedExtent, {
            duration: 5000, // Optional: duration for the zoom animation
            maxZoom: 32,    // Optional: maximum zoom level
        });
    });
</script>



<style>
    #finderMajorMap {
      height: 100%;
      width: 100%;
    }
  </style>
  <div id="finderMajorMap" class="w-full h-full"></div>
  