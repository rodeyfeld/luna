<script lang="ts">
import { onMount } from 'svelte';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';

export let studyData;

const imageryResults = studyData.results
const archiveFinderGeometry = studyData.archive_finder_geometry
const geoJSONGeometry =  new GeoJSON().readGeometry(archiveFinderGeometry);
const archiveFinderFeature = new Feature({
        geometry: geoJSONGeometry,
    });
const features = imageryResults.map((imageryResult: { geometry: any; }) => {
        const geometry = new GeoJSON().readGeometry(imageryResult.geometry);
        return new Feature(geometry)
    })

const archiveFinderFeatureStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 255, 100, .1)', // Fill color
    }),
    stroke: new Stroke({
        color: 'rgba(0, 255, 255, 1)', // Stroke color
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

const tileLayer = new TileLayer({
  source: new OSM(),
});
const vectorSource = new VectorSource({ 
  wrapX: false,
  features: [archiveFinderFeature]
 });
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: archiveFinderFeatureStyle
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
  const extent = geoJSONGeometry.getExtent();
  map.getView().fit(extent, { duration: 3000, maxZoom: 6 });
});


</script>
  
  <style>
    #map {
      height: 100%;
      width: 100%;
    }
  </style>
  <div id="map" class="w-full h-full"></div>
  