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
    footprintStyle,
    searchAreaStyle,
  } from "$lib/components/Map/MapUtils";
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
  baseFeatureLayer.setStyle(footprintStyle);
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
    style: searchAreaStyle,
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

<div class="flex h-full flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
  <div class="panel max-h-[50vh] min-w-0 overflow-y-auto lg:max-h-full">
    <Datatable
      data={study.study_data.results}
      on:resultHover={handleResultHover}
      on:resultLeave={handleResultLeave}
      on:resultSelect={handleResultSelect}
    ></Datatable>
  </div>
  <div class="map-frame h-[60vh] min-w-0 shrink-0 lg:h-full">
    <div id="map" class="h-full w-full"></div>
    <div class="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-3 rounded border border-line bg-night/85 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-haze">
      <span class="flex items-center gap-1.5"><span class="inline-block h-0 w-4 border-t border-dashed border-moon"></span>Search area</span>
      <span class="flex items-center gap-1.5"><span class="inline-block h-2.5 w-3 border border-tide/60"></span>Scenes</span>
      <span class="flex items-center gap-1.5"><span class="inline-block h-2.5 w-3 border-2 border-sodium bg-sodium/15"></span>Selected</span>
    </div>
  </div>
</div>
<ImageryResultHover {overlay} result={hoveredResult}></ImageryResultHover>
