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
  import { Stroke, Style } from "ol/style";
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
    const geometry = geojsonFormatter.readGeometry(
      study.study_data.imagery_finder_geometry
    );
    const extent = geometry.getExtent();
    map.getView().fit(extent, {
      duration: 1000,
      maxZoom: 5,
    });

    const filterDraw = newFilterDraw(baseFeatureLayer, featureStore);
    map.addInteraction(filterDraw);
  });
</script>

<div class="w-full h-full grid grid-cols-10 gap-1">
  <div class="col-span-5">
    <Datatable
      data={study.study_data.results}
      on:resultHover={handleResultHover}
      on:resultLeave={handleResultLeave}
      on:resultSelect={handleResultSelect}
    ></Datatable>
  </div>
  <div class="col-span-5">
    <div id="map" class="w-full h-full"></div>
  </div>
</div>
<ImageryResultHover {overlay} result={hoveredResult}></ImageryResultHover>

<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>
