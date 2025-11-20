<script lang="ts">
  import { onMount } from "svelte";
  import {
    getImageryFinderById,
    executeStudy,
    getStudyResults,
    getStudyStatus,
  } from "$lib/api/augur";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import EmptyState from "$lib/components/shared/EmptyState.svelte";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import { fromLonLat } from "ol/proj";
  import GeoJSON from "ol/format/GeoJSON";
  import Feature from "ol/Feature";
  import { Style, Fill, Stroke } from "ol/style";
  import "ol/ol.css";

  interface Props {
    data: { finderId: string };
  }

  let { data }: Props = $props();

  let mapElement = $state<HTMLDivElement | undefined>(undefined);
  let resultsMapElement = $state<HTMLDivElement | undefined>(undefined);
  let map: Map;
  let resultsMap: Map;

  let finder = $state<any>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let executing = $state(false);
  let activeTab = $state<"overview" | "studies" | "results">("overview");

  // Study results
  let selectedStudy = $state<any>(null);
  let studyResults = $state<any>(null);
  let loadingResults = $state(false);
  let resultsView = $state<"grid" | "table">("grid");

  const finderId = $derived(data.finderId);

  onMount(() => {
    loadFinder();

    return () => {
      map?.dispose();
      resultsMap?.dispose();
    };
  });

  async function loadFinder() {
    if (!finderId) return;

    loading = true;
    error = null;

    const response = await getImageryFinderById(finderId);

    if (response.error) {
      error = response.error;
      loading = false;
      return;
    }

    finder = response.data;
    loading = false;

    // Initialize map after data loads
    setTimeout(() => {
      if (finder) {
        initMap();
      }
    }, 100);
  }

  function initMap() {
    if (!finder || !mapElement) return;

    const vectorSource = new VectorSource();

    // Add the finder geometry to the map
    if (finder.geometry) {
      const geoJSON = new GeoJSON();
      const feature = geoJSON.readFeature(finder.geometry, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }) as Feature;

      feature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(59, 130, 246, 0.2)",
          }),
          stroke: new Stroke({
            color: "rgba(59, 130, 246, 1)",
            width: 3,
          }),
        })
      );

      vectorSource.addFeature(feature);
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map = new Map({
      target: mapElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2,
      }),
    });

    // Zoom to the geometry
    if (vectorSource.getFeatures().length > 0) {
      map.getView().fit(vectorSource.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 15,
      });
    }
  }

  function initResultsMap(studyData: any) {
    if (!resultsMapElement || !studyData) return;

    const vectorSource = new VectorSource();

    // Add the imagery finder area
    if (studyData.imagery_finder_geometry) {
      const geoJSON = new GeoJSON();
      const finderFeature = geoJSON.readFeature(
        studyData.imagery_finder_geometry,
        {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }
      ) as Feature;

      finderFeature.setStyle(
        new Style({
          fill: new Fill({
            color: "rgba(59, 130, 246, 0.1)",
          }),
          stroke: new Stroke({
            color: "rgba(59, 130, 246, 1)",
            width: 2,
          }),
        })
      );

      vectorSource.addFeature(finderFeature);
    }

    // Add imagery results
    if (studyData.results && studyData.results.length > 0) {
      const geoJSON = new GeoJSON();

      studyData.results.forEach((result: any) => {
        const feature = geoJSON.readFeature(result.geometry, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }) as Feature;

        feature.setStyle(
          new Style({
            fill: new Fill({
              color: "rgba(34, 197, 94, 0.2)",
            }),
            stroke: new Stroke({
              color: "rgba(34, 197, 94, 1)",
              width: 2,
            }),
          })
        );

        feature.set("result", result);
        vectorSource.addFeature(feature);
      });
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    resultsMap = new Map({
      target: resultsMapElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2,
      }),
    });

    // Zoom to all features
    if (vectorSource.getFeatures().length > 0) {
      resultsMap.getView().fit(vectorSource.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 15,
      });
    }
  }

  async function handleExecuteStudy(studyName: string) {
    if (!finder) return;

    executing = true;
    error = null;

    const response = await executeStudy(finder.id, studyName);

    if (response.error) {
      error = response.error;
    } else {
      // Reload finder to get updated studies
      await loadFinder();
    }

    executing = false;
  }

  async function viewStudyResults(study: any) {
    selectedStudy = study;
    loadingResults = true;
    activeTab = "results";

    const response = await getStudyResults(
      study.study_name,
      study.id.toString()
    );

    if (response.error) {
      error = response.error;
      loadingResults = false;
      return;
    }

    studyResults = response.data;
    loadingResults = false;

    // Initialize results map
    setTimeout(() => {
      if (studyResults?.study_data) {
        initResultsMap(studyResults.study_data);
      }
    }, 100);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<div class="w-full h-full overflow-y-auto">
  <div class="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
    {#if loading}
      <LoadingSpinner message="Loading imagery finder..." />
    {:else if error && !finder}
      <div class="card p-8">
        <EmptyState icon="⚠️" title="Error Loading Finder" description={error}>
          {#snippet action()}
            <a
              href="/dashboard"
              class="btn variant-soft-primary"
            >
              Back to Dashboard
            </a>
          {/snippet}
        </EmptyState>
      </div>
    {:else if finder}
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div class="flex items-start gap-4">
          <a
            href="/dashboard"
            class="btn btn-sm variant-ghost-surface"
            aria-label="Back to Dashboard"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold">{finder.name}</h1>
              <StatusBadge status={finder.is_active ? "ACTIVE" : "INACTIVE"} />
            </div>
            <p class="text-surface-600-300-token">
              {formatDate(finder.start_date)} - {formatDate(finder.end_date)}
            </p>
          </div>
        </div>

        <button
          onclick={() => handleExecuteStudy("archive_lookup")}
          disabled={executing}
          class="btn variant-filled-primary"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{executing ? "Executing..." : "Execute Study"}</span>
        </button>
      </div>

      {#if error}
        <aside class="alert variant-filled-error">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="alert-message">
            <p>{error}</p>
          </div>
        </aside>
      {/if}

      <!-- Tabs -->
      <div class="card p-1">
        <div class="flex gap-2">
          <button
            onclick={() => (activeTab = "overview")}
            class="btn flex-1 {activeTab === 'overview'
              ? 'variant-filled-primary'
              : 'variant-ghost-surface'}"
          >
            Overview
          </button>
          <button
            onclick={() => (activeTab = "studies")}
            class="btn flex-1 {activeTab === 'studies'
              ? 'variant-filled-primary'
              : 'variant-ghost-surface'}"
          >
            Studies ({finder.studies?.length || 0})
          </button>
          <button
            onclick={() => (activeTab = "results")}
            class="btn flex-1 {activeTab === 'results'
              ? 'variant-filled-primary'
              : 'variant-ghost-surface'}"
          >
            Results
          </button>
        </div>
      </div>

      <!-- Overview Tab -->
      {#if activeTab === "overview"}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card p-6 space-y-4">
            <h2 class="text-2xl font-bold">Details</h2>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-surface-600-300-token">Geometry Type</p>
                <p class="font-medium">{finder.geometry.type}</p>
              </div>

              <div>
                <p class="text-sm text-surface-600-300-token">Date Range</p>
                <p class="font-medium">
                  {formatDate(finder.start_date)} - {formatDate(
                    finder.end_date
                  )}
                </p>
              </div>

              <div>
                <p class="text-sm text-surface-600-300-token">Status</p>
                <StatusBadge
                  status={finder.is_active ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              {#if finder.rules && Object.keys(finder.rules).length > 0}
                <div>
                  <p class="text-sm text-surface-600-300-token mb-2">
                    Search Rules
                  </p>
                  <div
                    class="p-3 bg-surface-100-800-token rounded-lg space-y-1 text-sm"
                  >
                    {#each Object.entries(JSON.parse(finder.rules)) as [key, value]}
                      {#if value !== null}
                        <p><span class="font-medium">{key}:</span> {value}</p>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="card p-6 space-y-4">
            <h2 class="text-2xl font-bold">Area of Interest</h2>
            <div class="map-container" bind:this={mapElement}></div>
          </div>
        </div>

        <!-- Study Options -->
        {#if finder.study_options && finder.study_options.length > 0}
          <div class="card p-6">
            <h2 class="text-2xl font-bold mb-4">Available Studies</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each finder.study_options as option}
                <div class="p-4 bg-surface-100-800-token rounded-lg">
                  <p class="font-semibold">{option.study_name}</p>
                  <button
                    onclick={() => handleExecuteStudy(option.study_name)}
                    disabled={executing}
                    class="btn btn-sm variant-soft-primary mt-2"
                  >
                    Execute
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/if}

      <!-- Studies Tab -->
      {#if activeTab === "studies"}
        <div class="card p-6">
          <h2 class="text-2xl font-bold mb-6">Studies</h2>

          {#if finder.studies && finder.studies.length > 0}
            <div class="space-y-3">
              {#each finder.studies as study}
                <div
                  class="p-4 rounded-lg hover:bg-surface-200-700-token transition-smooth"
                >
                  <div
                    class="flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <StatusBadge status={study.status} />
                        <span class="font-semibold">{study.study_name}</span>
                      </div>
                      <p class="text-sm text-surface-600-300-token">
                        Created: {formatDateTime(study.created)}
                      </p>
                    </div>
                    <button
                      onclick={() => viewStudyResults(study)}
                      class="btn btn-sm variant-soft-primary"
                      disabled={study.status !== "COMPLETED"}
                    >
                      {study.status === "COMPLETED"
                        ? "View Results"
                        : "Pending"}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <EmptyState
              icon="📊"
              title="No Studies Yet"
              description="Execute a study to search for satellite imagery in this area"
            >
              {#snippet action()}
                <button
                  onclick={() => handleExecuteStudy("archive_lookup")}
                  disabled={executing}
                  class="btn variant-filled-primary"
                >
                  Execute Imagery Study
                </button>
              {/snippet}
            </EmptyState>
          {/if}
        </div>
      {/if}

      <!-- Results Tab -->
      {#if activeTab === "results"}
        {#if loadingResults}
          <LoadingSpinner message="Loading results..." />
        {:else if studyResults}
          <div class="space-y-6">
            <!-- Results Map -->
            <div class="card p-6">
              <h2 class="text-2xl font-bold mb-4">Results Map</h2>
              <div
                class="results-map-container"
                bind:this={resultsMapElement}
              ></div>
              <p class="text-sm text-surface-600-300-token mt-4">
                <span
                  class="inline-block w-4 h-4 bg-blue-500/20 border-2 border-blue-500 mr-2"
                ></span>
                Search Area
                <span
                  class="inline-block w-4 h-4 bg-green-500/20 border-2 border-green-500 mr-2 ml-4"
                ></span>
                Imagery Results
              </p>
            </div>

            <!-- Results List -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">
                Imagery Results ({studyResults.study_data?.results?.length ||
                  0})
              </h2>
                <div class="btn-group">
                  <button
                    type="button"
                    class={`btn btn-sm ${resultsView === 'grid' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
                    onclick={() => (resultsView = 'grid')}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    class={`btn btn-sm ${resultsView === 'table' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
                    onclick={() => (resultsView = 'table')}
                  >
                    Table
                  </button>
                </div>
              </div>

              {#if studyResults.study_data?.results && studyResults.study_data.results.length > 0}
                {#if resultsView === 'grid'}
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {#each studyResults.study_data.results as result}
                    <div class="card p-4 hover-lift">
                      {#if result.thumbnail}
                        <img
                          src={result.thumbnail}
                          alt={result.collection}
                          class="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      {/if}
                      <h3 class="font-semibold mb-2">{result.collection}</h3>
                      <div class="space-y-1 text-sm text-surface-600-300-token">
                        <p>
                          Sensor: {result.sensor.name ||
                            result.sensor.technique}
                        </p>
                        <p>Date: {formatDate(result.start_date)}</p>
                        <p>Type: {result.geometry.type}</p>
                      </div>
                    </div>
                  {/each}
                </div>
                {:else}
                  <div class="overflow-x-auto">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Collection</th>
                          <th>Sensor</th>
                          <th>Technique</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Geometry</th>
                          <th>Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each studyResults.study_data.results as result}
                          <tr>
                            <td class="font-semibold">{result.collection}</td>
                            <td>{result.sensor.name || '—'}</td>
                            <td>{result.sensor.technique || '—'}</td>
                            <td>{formatDate(result.start_date)}</td>
                            <td>{formatDate(result.end_date)}</td>
                            <td>{result.geometry.type}</td>
                            <td>{result.provider || '—'}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              {:else}
                <EmptyState
                  icon="🔍"
                  title="No Results Found"
                  description="No imagery was found matching your search criteria"
                />
              {/if}
            </div>
          </div>
        {:else if !selectedStudy}
          <div class="card p-6">
            <EmptyState
              icon="📊"
              title="Select a Study"
              description="Go to the Studies tab and select a completed study to view results"
            >
              {#snippet action()}
                <button
                  onclick={() => (activeTab = "studies")}
                  class="btn variant-soft-primary"
                >
                  View Studies
                </button>
              {/snippet}
            </EmptyState>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  .map-container {
    height: 400px;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .results-map-container {
    height: 500px;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
  }
</style>
