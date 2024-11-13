<script lang="ts">
    import { onMount } from 'svelte';
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from 'ol/source/OSM.js';
    import { Vector as VectorLayer } from 'ol/layer.js';
    import { Vector as VectorSource } from 'ol/source.js';
      
    const tileLayer = new TileLayer({
      source: new OSM(),
    });
    const vectorSource = new VectorSource({ wrapX: false });
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
        target: 'map',
      });
    });
  </script>
  
  <style>
    #map {
      height: 100%;
      width: 100%;
    }
  </style>
  <div id="map" class="w-full h-full"></div>
  