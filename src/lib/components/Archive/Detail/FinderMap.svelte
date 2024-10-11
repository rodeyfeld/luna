<script lang="ts">
    import { onMount } from 'svelte';
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from 'ol/source/OSM.js';
    import { Vector as VectorLayer } from 'ol/layer.js';
    import { Vector as VectorSource } from 'ol/source.js';
    import { Draw, Modify, Snap } from 'ol/interaction.js';
    import { Point, Polygon, type Geometry } from 'ol/geom';
    import { Feature } from 'ol';
    import GeoJSON from 'ol/format/GeoJSON';


    export let finderData;
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
    let draw; // to keep track of the draw interaction
    let currentPoint: Feature<Geometry>; // to store the currently drawn point
    let polygonFeature: Feature<Geometry>; // to store the currently drawn point

    onMount(() => {
        map = new Map({
        view: new View({
            center: [0, 0],
            zoom: 1,
        }),
        layers: [tileLayer, vectorLayer],
        target: 'finderMiniMap',
        });
        const extent = geometry.getExtent();
        console.log(extent)
    
        // Fit the map view to the extent of the geometry
        map.getView().fit(extent, {
            duration: 5000, // Optional: duration for the zoom animation
            maxZoom: 32,    // Optional: maximum zoom level
        });
    });
</script>

{finderData}


<style>
    #finderMiniMap {
      height: 48vh;
      width: 100%;
    }
  </style>
  <div id="finderMiniMap" class="w-full h-full"></div>
  