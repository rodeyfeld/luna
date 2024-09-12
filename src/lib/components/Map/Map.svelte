<script lang="ts">  
  import { onMount } from 'svelte';
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import TileLayer from 'ol/layer/Tile.js';
  import OSM from 'ol/source/OSM.js';
  import {Vector as VectorLayer} from 'ol/layer.js';
  import {Vector as VectorSource} from 'ol/source.js';
  import Draw from 'ol/interaction/Draw.js';

  const tileLayer = new TileLayer({
    source: new OSM(),
  });
  const vectorSource = new VectorSource({wrapX: false});

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  const typeSelect = 'Point';
  var map: Map;
  onMount(() => {
    map = new Map({
        view: new View({
          center: [0, 0],
          zoom: 1,
        }),
        layers: [
          tileLayer,
          vectorLayer
        ],
        target: 'map',
      });

    let draw = new Draw({
      source: vectorSource,
      type: typeSelect,
    });
    map.addInteraction(draw);
    })
</script>

<style>
  #map {
    height: 100%;
    width: 100%;
    filter: brightness(50%);
  }
</style>

<div id="map"></div>
