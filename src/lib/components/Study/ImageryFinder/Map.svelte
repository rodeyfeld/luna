<script lang="ts">
  import { onMount } from "svelte";
  import { Feature } from "ol";
  import type Map from "ol/Map";
  import GeoJSON from "ol/format/GeoJSON";
  import { getCenter } from "ol/extent";

  import Overlay from "ol/Overlay.js";
  import {
    newBaseFeatureLayer,
    newHighlightFeatureLayer,
    highlightFeature,
    lunaMap,
    newDrawFeatureLayer,
    newBaseDraw,
    newBaseModify,
    newFilterFeatureLayer,
    newFilterDraw,
  } from "$lib/components/Map/MapUtils";
  import { Fill, Stroke, Style } from "ol/style";
  import VectorLayer from "ol/layer/Vector";
  import { Vector as VectorSource } from "ol/source";
  import ImageryResultHover from "./SideBar/ImageryResultHover.svelte";
  import Datatable, {
    type ArchiveLookupResult,
  } from "./SideBar/Datatable.svelte";
  import {
    featureStore,
    selectedArchiveResultGeoJson,
    selectedArchiveResultThumbnail,
  } from "$lib/stores/archive_store";

  let { study } = $props();

  const uniqueGeometries = new Set<string>();
  const geojsonFormatter = new GeoJSON();

  const features = study.study_data.results
    .map((imageryResult: { geometry: any }) => {
      const geometry = geojsonFormatter.readGeometry(imageryResult.geometry);
      const coordinates: string = imageryResult.geometry.coordinates.toString();
      return { geometry, coordinates };
    })
    .filter(({ coordinates }: { coordinates: string }) => {
      if (uniqueGeometries.has(coordinates)) {
        return false;
      }
      uniqueGeometries.add(coordinates);
      return true;
    })
    .map(({ geometry }: { geometry: any }) => new Feature(geometry));

  const baseFeatureLayer = newBaseFeatureLayer(features);
  featureStore.set(features);
  baseFeatureLayer.setStyle(
    new Style({
      stroke: new Stroke({
        color: "#5f7b97",
        width: 0.5,
      }),
    })
  );
  const highlightFeatureLayer = newHighlightFeatureLayer();
  const filterFeatureLayer = newFilterFeatureLayer();

  // Create finder geometry layer (the search area) with distinct styling
  const finderGeometry = study.study_data.imagery_finder_geometry
    ? geojsonFormatter.readGeometry(study.study_data.imagery_finder_geometry)
    : null;
  const finderFeature = finderGeometry ? new Feature(finderGeometry) : null;
  const finderLayer = new VectorLayer({
    source: new VectorSource({
      features: finderFeature ? [finderFeature] : [],
    }),
    style: new Style({
      fill: new Fill({
        color: "rgba(251, 191, 36, 0.15)", // amber/gold fill
      }),
      stroke: new Stroke({
        color: "#f59e0b", // amber stroke
        width: 3,
        lineDash: [8, 4],
      }),
    }),
  });

  const unsubscribe = selectedArchiveResultGeoJson.subscribe((value) => {
    highlightFeature(highlightFeatureLayer, value);
  });

  let map: Map | undefined = $state();
  let overlay: Overlay | undefined = $state();
  let hoveredResult = $state<ArchiveLookupResult | null>(null);

  function focusOnResult(
    result: ArchiveLookupResult | null,
    shouldZoom = false
  ) {
    if (!result || !result.geometry) {
      overlay?.setPosition(undefined);
      return;
    }
    const geometryString = JSON.stringify(result.geometry);
    selectedArchiveResultGeoJson.set(geometryString);
    selectedArchiveResultThumbnail.set(result.thumbnail || "");
    const geometry = geojsonFormatter.readGeometry(result.geometry);
    const center = getCenter(geometry.getExtent());
    overlay?.setPosition(center);

    if (shouldZoom && map) {
      map.getView().fit(geometry.getExtent(), {
        duration: 750,
        maxZoom: 7,
        padding: [40, 40, 40, 40],
      });
    }
  }

  function handleResultHover(
    event: CustomEvent<{ result: ArchiveLookupResult }>
  ) {
    hoveredResult = event.detail.result;
    focusOnResult(hoveredResult);
  }

  function handleResultLeave() {
    hoveredResult = null;
    overlay?.setPosition(undefined);
    selectedArchiveResultThumbnail.set("");
  }

  function handleResultSelect(
    event: CustomEvent<{ result: ArchiveLookupResult }>
  ) {
    hoveredResult = event.detail.result;
    focusOnResult(hoveredResult, true);
  }
  onMount(() => {
    map = lunaMap("map");
    
    // Add finder geometry layer first (underneath results)
    map.addLayer(finderLayer);
    map.addLayer(baseFeatureLayer);
    map.addLayer(highlightFeatureLayer);
    
    const container = document.querySelector("#image-popup") as HTMLElement;
    overlay = new Overlay({
      element: container,
      autoPan: {
        animation: { duration: 250 },
      },
    });
    map.addOverlay(overlay);
    
    // Zoom to finder geometry
    if (finderGeometry) {
      const extent = finderGeometry.getExtent();
      map.getView().fit(extent, {
        duration: 1000,
        maxZoom: 8,
        padding: [50, 50, 50, 50],
      });
    }

    const filterDraw = newFilterDraw(baseFeatureLayer, featureStore);
    map.addInteraction(filterDraw);
  });
</script>

<div class="w-full h-full grid grid-cols-12 gap-2">
  <div class="col-span-5 overflow-y-auto max-h-full">
    <Datatable
      data={study.study_data.results}
      on:resultHover={handleResultHover}
      on:resultLeave={handleResultLeave}
      on:resultSelect={handleResultSelect}
    ></Datatable>
  </div>
  <div class="col-span-7">
    <div id="map" class="w-full h-full rounded-lg overflow-hidden"></div>
  </div>
</div>
<ImageryResultHover {overlay} result={hoveredResult}></ImageryResultHover>

<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>
