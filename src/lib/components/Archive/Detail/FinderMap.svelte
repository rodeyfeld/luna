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
    import { transformExtent } from 'ol/proj';


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

    onMount(() => {
        map = new Map({
        view: new View({
            center: [0, 0],
            zoom: 1,
            projection: 'EPSG:4326',
        }),
        layers: [tileLayer, vectorLayer],
        target: 'finderMiniMap',
        });

        const geometry = new GeoJSON().readGeometry(finderData.geometry);
        const extent = geometry.getExtent();
        map.getView().fit(extent, {
            duration: 3000, 
            maxZoom: 8,    
        });
    });
</script>


<style>
    #finderMiniMap {
      height: 48vh;
      width: 100%;
    }
  </style>
  <div id="finderMiniMap" class="w-full h-full"></div>
  