<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
  import PaginatedList from "$lib/components/shared/PaginatedList.svelte";
  import { createSimpleGeometryMap } from "$lib/components/Map/MapUtils";
  import { formatDate, formatDateTime } from "$lib/utils/dates";
  import type Map from "ol/Map";
  import "ol/ol.css";

  interface Props {
    data: { finderId: string; finderData?: any };
  }

  let { data }: Props = $props();

  let mapElement = $state<HTMLDivElement | undefined>(undefined);
  let map: Map;

  let finder = $state<any>(data.finderData || null);
  let loading = $state(!data.finderData);
  let error = $state<string | null>(null);
  let executing = $state(false);

  const finderId = $derived(data.finderId);

  // Watch for changes to finderId and reload data
  $effect(() => {
    if (finderId) {
      // Dispose old map if it exists
      if (map) {
        map.dispose();
        map = undefined as any;
      }
      // Load the new finder
      loadFinder();
    }
  });

  onMount(() => {
    return () => {
      map?.dispose();
    };
  });

  async function loadFinder(silent = false) {
    if (!finderId) {
      loading = false;
      error = "No finder ID provided";
      return;
    }

    // Only show loading state on initial load, not on silent refresh
    if (!silent) {
      loading = true;
      error = null;
      finder = null;
    }

    try {
      const response = await fetch(`/api/archive/finder_data/${finderId}`);

      if (!response.ok) {
        error = `Failed to load finder: ${response.statusText}`;
        return;
      }
      const data = await response.json();

      if (!data) {
        error = "No finder data returned from server";
        return;
      }

      finder = data;

      // Only init map on initial load
      if (!silent) {
        setTimeout(() => {
          if (finder) {
            initMap();
          }
        }, 100);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load finder";
    } finally {
      if (!silent) {
        loading = false;
      }
    }
  }

  function initMap() {
    if (!finder || !mapElement) return;

    const rawGeometry = finder.geometry || finder.location?.geometry || null;

    if (!rawGeometry) {
      console.warn("Finder missing geometry data");
      return;
    }

    map = createSimpleGeometryMap(mapElement, rawGeometry, {
      fillColor: "rgba(59, 130, 246, 0.2)",
      strokeColor: "rgba(59, 130, 246, 1)",
      strokeWidth: 2,
      padding: [60, 60, 60, 60],
      duration: 500,
    });
  }

  async function handleExecuteStudy() {
    if (!finder) return;

    executing = true;
    error = null;

    try {
      const response = await fetch("/api/archive/finder_execute", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          imagery_finder_id: finder.id,
          study_name: "archive_lookup",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        error = `Failed to execute study: ${response.statusText}`;
        console.error("Execute study error:", errorData);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to execute study";
      console.error("Execute study error:", err);
    } finally {
      // Show spinner for at least 1-2 seconds for better UX
      const minSpinTime = 1000 + Math.random() * 1000; // 1-2 seconds
      const spinPromise = new Promise((resolve) =>
        setTimeout(resolve, minSpinTime)
      );

      // Wait for database transaction to commit
      const dbPromise = new Promise((resolve) => setTimeout(resolve, 1500));

      // Wait for both
      await Promise.all([spinPromise, dbPromise]);

      executing = false;

      // Silently refresh the finder data without showing loading state
      await loadFinder(true);
      // Invalidate layout to update sidebar
      await invalidateAll();
    }
  }

  function viewStudyResults(study: any) {
    goto(`/archive/finder/${finderId}/study/${study.study_name}/${study.id}`);
  }
</script>

{#if loading}
  <div class="w-full h-full flex items-center justify-center">
    <LoadingSpinner message="Loading imagery finder..." />
  </div>
{:else if error && !finder}
  <div class="w-full h-full p-6">
    <SectionPanel>
      <div class="text-center py-12">
        <div class="text-6xl mb-4 opacity-30">⚠️</div>
        <h2 class="text-xl font-bold mb-2">Error Loading Finder</h2>
        <p class="text-surface-400 mb-6">{error}</p>
        <a href="/archive" class="btn variant-soft-primary">
          Back to Archive
        </a>
      </div>
    </SectionPanel>
  </div>
{:else if finder}
  <div class="w-full h-full overflow-y-auto p-6 space-y-4">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm mb-2">
      <a
        href="/dashboard"
        class="text-surface-400 hover:text-surface-200 transition-smooth"
      >
        Dashboard
      </a>
      <svg
        class="w-4 h-4 text-surface-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
      <a
        href="/areas-of-interest"
        class="text-surface-400 hover:text-surface-200 transition-smooth"
      >
        Areas of Interest
      </a>
      {#if finder?.location?.id}
        <svg
          class="w-4 h-4 text-surface-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <a
          href="/areas-of-interest/{finder.location.id}"
          class="text-surface-400 hover:text-surface-200 transition-smooth"
        >
          {finder.location.name || `Location #${finder.location.id}`}
        </a>
      {/if}
      <svg
        class="w-4 h-4 text-surface-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
      <span class="text-surface-200 font-medium"
        >{finder?.name || "Finder"}</span
      >
    </nav>

    <!-- Finder Details with Map -->
    <SectionPanel>
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold mb-2 truncate">{finder.name}</h1>
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <StatusBadge status={finder.is_active ? "ACTIVE" : "INACTIVE"} />
            <span class="text-surface-400">•</span>
            <span class="text-surface-400"
              >{formatDate(finder.start_date)} - {formatDate(
                finder.end_date
              )}</span
            >
            <span class="text-surface-400">•</span>
            <span class="text-surface-400"
              >{finder?.geometry?.type ||
                finder?.location?.geometry?.type ||
                "Unknown"}</span
            >
          </div>
        </div>

        <button
          onclick={handleExecuteStudy}
          disabled={executing}
          class="btn variant-filled-primary btn-sm shrink-0 ml-4"
        >
          {#if executing}
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Executing...</span>
          {:else}
            <svg
              class="w-4 h-4"
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
            <span>Execute</span>
          {/if}
        </button>
      </div>

      {#if error}
        <aside class="alert variant-filled-error mb-4">
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left: Parameters -->
        <div class="space-y-3">
          {#if finder.rules && Object.keys(finder.rules).length > 0}
            <div>
              <h3
                class="text-xs uppercase tracking-wider text-surface-400 mb-2"
              >
                Search Parameters
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each Object.entries(JSON.parse(finder.rules)) as [key, value]}
                  {#if value !== null}
                    <span class="badge variant-soft-surface text-xs">
                      <span class="text-primary-400">{key}:</span>
                      <span class="ml-1">{value}</span>
                    </span>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}

          <div>
            <h3 class="text-xs uppercase tracking-wider text-surface-400 mb-2">
              Summary
            </h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-surface-500">Studies:</span>
                <span class="font-medium ml-1"
                  >{finder.studies?.length || 0}</span
                >
              </div>
              <div>
                <span class="text-surface-500">ID:</span>
                <span class="font-medium ml-1">{finder.id}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Map -->
        <div>
          <h3 class="text-xs uppercase tracking-wider text-surface-400 mb-2">
            Area of Interest
          </h3>
          <div class="aoi-map-container" bind:this={mapElement}></div>
        </div>
      </div>
    </SectionPanel>

    <!-- Study Runs Table -->
    <SectionPanel>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Study Runs</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs text-surface-500">
            {finder.studies?.length || 0} total
          </span>
          <button
            onclick={() => loadFinder(true)}
            disabled={loading}
            class="btn btn-sm variant-soft-surface"
            title="Refresh study runs"
          >
            <svg
              class="w-4 h-4 {loading ? 'animate-spin' : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <PaginatedList
        items={finder.studies || []}
        itemsPerPage={5}
        emptyMessage="No study runs yet. Execute a study to start searching for satellite imagery."
        emptyIcon="📊"
      >
        {#snippet children(study)}
          <div class="tile">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <StatusBadge status={study.status} />
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{study.study_name}</p>
                  <p class="text-sm text-surface-400">
                    {formatDateTime(study.created)} • {formatDate(
                      finder.start_date
                    )} - {formatDate(finder.end_date)}
                  </p>
                </div>
              </div>
              <a
                href="/archive/finder/{finderId}/study/{study.study_name}/{study.id}"
                class="btn btn-sm {study.status === 'COMPLETED'
                  ? 'variant-soft-primary'
                  : 'variant-soft-surface'}"
              >
                View
              </a>
            </div>
          </div>
        {/snippet}
      </PaginatedList>
    </SectionPanel>
  </div>
{/if}

<style>
  .aoi-map-container {
    height: 200px;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
</style>
