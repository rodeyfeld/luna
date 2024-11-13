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
import Overlay from 'ol-ext/control/Overlay';
import GeoJSON from 'ol/format/GeoJSON';

export let studyData;

const imageryResults = studyData.results
const archiveFinderGeometry = studyData.archive_finder_geometry
const geoJSONGeometry =  new GeoJSON().readGeometry(archiveFinderGeometry);
const archiveFinderFeature = new Feature({
        geometry: geoJSONGeometry,
    });
const imageryResultFeatures = imageryResults.map((imageryResult: { geometry: any; }) => {
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

const imageryResultFeatureStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 0, 0)', // Fill color
    }),
    stroke: new Stroke({
        color: 'rgba(0, 255, 0, 1)', // Stroke color
        width: 2, // Stroke width
    }),
});

const tileLayer = new TileLayer({
  source: new OSM(),
});

tileLayer.on('prerender', (evt) => {
  // return
  if (evt.context) {
    const context = evt.context as CanvasRenderingContext2D;
    context.filter = 'grayscale(80%) invert(100%) ';
    context.globalCompositeOperation = 'source-over';
  }
});

tileLayer.on('postrender', (evt) => {
  if (evt.context) {
    const context = evt.context as CanvasRenderingContext2D;
    context.filter = 'none';
  }
});

const finderVectorSource = new VectorSource({ 
  wrapX: false,
  features: [archiveFinderFeature]
 });
const finderVectorLayer = new VectorLayer({
  source: finderVectorSource,
  style: archiveFinderFeatureStyle
});

const resultsVectorSource = new VectorSource({ 
  wrapX: false,
  features: imageryResultFeatures
 });
const resultsVectorLayer = new VectorLayer({
  source: resultsVectorSource,
  style: imageryResultFeatureStyle
});

var map: Map;

// var menu = new Overlay ({ 
//     closeBox : true, 
//     className: "slide-left menu", 
//     content: "test"
//   });

onMount(() => {
  map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 1,
      projection: 'EPSG:4326',
    }),
    layers: [tileLayer, finderVectorLayer, resultsVectorLayer],
    target: 'map',
  });
  const extent = geoJSONGeometry.getExtent();
  map.getView().fit(extent, { duration: 3000, maxZoom: 6 });
  // map.addControl(menu);
});


</script>
  
  <style>
    #map {
      height: 100%;
      width: 100%;
    }
  </style>
  <div id="map" class="w-full h-full"></div>
  <!-- <div id="overlay-menu">
    Woah
    <nav class="list-nav">
        <ul>
            {#each imageryResults as imageryResult}
            <li>
              {imageryResult.sensor.name}
                 <ImageryResultHover imageryResult={imageryResult}></ImageryResultHover> 
            </li>
            {/each}
        </ul>
    </nav>
</div> -->