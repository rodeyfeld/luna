<script lang="ts">
import { getDrawerStore, Paginator, type DrawerSettings, type PaginationSettings } from "@skeletonlabs/skeleton";
import { onDestroy, onMount } from 'svelte';
import OLMap from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import { Feature } from 'ol';
import Overlay from 'ol-ext/control/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
    import ImageryResultHover from "./ImageryResultHover.svelte";
    import { selectedArchiveResultGeoJson } from "$lib/stores/archive_store";

const drawerStore = getDrawerStore();
export let studyData;

const imageryResults = studyData.results
const archiveFinderGeometry = studyData.archive_finder_geometry
const geoJSONGeometry =  new GeoJSON().readGeometry(archiveFinderGeometry);
const archiveFinderFeature = new Feature({
        geometry: geoJSONGeometry,
    });


const archiveFinderFeatureStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 255, 100, .1)', // Fill color
    }),
    stroke: new Stroke({
        color: 'rgba(0, 255, 255, 1)', // Stroke color
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



var map: OLMap;

// var menu = new Overlay ({ 
//     closeBox : true, 
//     className: "slide-left menu", 
//     content: "test"
//   });

onMount(() => {


  const featureDataMap = new Map();


  imageryResults.forEach((imageryResult: any) => {
    const coordStr = imageryResult.geometry.coordinates.toString();
    const geometry = new GeoJSON().readGeometry(imageryResult.geometry);
    let coordData = featureDataMap.get(coordStr);

    if (coordData) {
      coordData.count += 1;
    } 
    else {
      coordData = {
        geometry: geometry,
        count: 1
      };
      featureDataMap.set(coordStr, coordData);
    }
    
  });

  const features: Feature<any>[] = []
  featureDataMap.forEach((value, key) => {
    const geometry = value.geometry
    console.log(key)
    const count = value.count
    const feature = new Feature(geometry)

    const strokeMulti = .05
    const strokeStrength = strokeMulti * count 
    const imageryResultFeatureStyle = new Style({
      
        // fill: new Fill({
        //     color: 'rgba(0, 0, 0, .01)',
        // }),
        stroke: new Stroke({
            color: `rgba(0, 255, 0, ${strokeStrength})`,
            width: 2, 
        }),
    });

    
    feature.setStyle(imageryResultFeatureStyle)
    features.push(feature)
  });
  const resultsVectorSource = new VectorSource({ 
    wrapX: false,
    features: features
  });
  const resultsVectorLayer = new VectorLayer({
    source: resultsVectorSource,
  });

  map = new OLMap({
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
function trigger(position: 'left' | 'top' | 'right' | 'bottom'): void {
		const s: DrawerSettings = {
       id: 'demo',
        position,
        width: 'w-[280px] md:w-[480px]',
        
      };
		drawerStore.open(s);
	}
  let paginationSettings = {
	page: 0,
	limit: 5,
	size: imageryResults.length,
	amounts: [1,2,5,10],
} satisfies PaginationSettings;
$: paginatedSource = imageryResults.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);

let highlightedFeature: Feature | null = null; // To store the highlighted feature

const selectedFeatureStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 255, 1)', // Fill color
        }),
        stroke: new Stroke({
            color: '#FFFF00', // Stroke color
            width: 4, // Stroke width
        }),
    });

const unsubscribe = selectedArchiveResultGeoJson.subscribe(value => {
        if (value) {
            // Clear the previously highlighted feature
            if (highlightedFeature) {
              finderVectorSource.removeFeature(highlightedFeature);
            }

            // Create and add the new highlighted feature
            const geometry = new GeoJSON().readGeometry(value);
            highlightedFeature = new Feature(geometry);
            highlightedFeature.setStyle(selectedFeatureStyle);
            console.log(geometry)
            finderVectorSource.addFeature(highlightedFeature);
        }
    });

    // Clean up the subscription on component destroy
    onDestroy(() => {
        unsubscribe();
    });
</script>
  
<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>

<Paginator
bind:settings={paginationSettings}
showFirstLastButtons="{true}"
showPreviousNextButtons="{true}"
/>
<div class="w-full h-full grid grid-cols-10 gap-1" >
  <div class="col-span-8">
    <div id="map" class="w-full h-full"></div>
  </div>
  <div class="col-span-2">
    <nav class="list-nav overflow-y-auto max-h-[68vh]">
        <ul>
            {#each paginatedSource as imageryResult}
            <li>
                <ImageryResultHover imageryResult={imageryResult}></ImageryResultHover>
            </li>
            {/each}
        </ul>
    </nav>
  </div>
</div>