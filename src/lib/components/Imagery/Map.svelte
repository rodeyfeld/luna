<script lang="ts">
  import { onMount } from "svelte";
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import TileLayer from "ol/layer/Tile.js";
  import OSM from "ol/source/OSM.js";
  import VectorLayer from "ol/layer/Vector";
  import { Vector as VectorSource } from "ol/source.js";
  import { Draw, Modify, Snap } from "ol/interaction.js";
  import { Point, Polygon, type Geometry } from "ol/geom";
  import { Feature } from "ol";
  import GeoJSON from "ol/format/GeoJSON";

  const tileLayer = new TileLayer({
    source: new OSM(),
  });

  const vectorSource = new VectorSource({ wrapX: false });

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
        projection: "EPSG:4326",
      }),
      layers: [tileLayer, vectorLayer],
      target: "map",
    });

    const modify = new Modify({ source: vectorSource });
    map.addInteraction(modify);
    // Listen for feature modifications

    // Initialize draw interaction
    draw = new Draw({
      source: vectorSource,
      type: "Point",
    });

    // Listen for drawend event

    // Add interactions to the map
    map.addInteraction(draw);
    const snap = new Snap({ source: vectorSource });
    map.addInteraction(snap);
  });
</script>

<div id="map" class="w-full h-full"></div>

<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>
