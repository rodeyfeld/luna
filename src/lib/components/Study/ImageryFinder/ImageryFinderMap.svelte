<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import OLMap from 'ol/Map.js';
import View from 'ol/View.js';    
import Overlay from 'ol/Overlay.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Fill, Stroke, Style} from 'ol/style.js';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { selectedArchiveResultGeoJson } from "$lib/stores/archive_store";
import ImageryResultTable from "./SideBar/ImageryResultTable.svelte";
import ImageryResultHover from "./SideBar/ImageryResultHover.svelte";
    import Datatable from './SideBar/Datatable.svelte';

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

const finderVectorSource = new VectorSource({ 
  wrapX: false,
  features: [archiveFinderFeature]
 });
const finderVectorLayer = new VectorLayer({
  source: finderVectorSource,
  style: archiveFinderFeatureStyle
});


let overlay: Overlay

onMount(() => {
  
  
  var map: OLMap;
  const container = document.querySelector('#image-popup') as HTMLElement;
  overlay = new Overlay({
      element: container,
      autoPan: {
          animation: { duration: 250 },
      },
  });

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
    const count = value.count
    const feature = new Feature(geometry)

    const strokeMulti = .05
    // const strokeStrength = strokeMulti * count 
    const strokeStrength = .01
    const imageryResultFeatureStyle = new Style({
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
    overlays: [overlay],
    target: 'map',
  });
  const extent = geoJSONGeometry.getExtent();
  map.getView().fit(extent, { duration: 3000, maxZoom: 6 });
  

  // map.addControl(menu);
});
let highlightedFeature: Feature | null = null; // To store the highlighted feature

const selectedFeatureStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 255, .2)', // Fill color
        }),
        stroke: new Stroke({
            color: '#FFFF00', // Stroke color
            width: 4, // Stroke width
        }),
    });

const geoJsonUnsubscribe = selectedArchiveResultGeoJson.subscribe(value => {
        if (value) {
            // Clear the previously highlighted feature
            if (highlightedFeature) {
              finderVectorSource.removeFeature(highlightedFeature);
            }

            // Create and add the new highlighted feature
            const geometry = new GeoJSON().readGeometry(value);
            highlightedFeature = new Feature(geometry);
            highlightedFeature.setStyle(selectedFeatureStyle);
            finderVectorSource.addFeature(highlightedFeature);
        }
    });

// Clean up the subscription on component destroy
onDestroy(() => {
    geoJsonUnsubscribe();
});
</script>
  
<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>

<div class="w-full h-full grid grid-cols-10 gap-1" >
  <div class="col-span-8">
    <div id="map" class=""></div>
  </div>
  <div class="col-span-2">
    <Datatable data={imageryResults}></Datatable>
  </div>
</div>
<ImageryResultHover overlay={overlay}></ImageryResultHover>