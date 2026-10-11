<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import PaginatedList from "$lib/components/shared/PaginatedList.svelte";
  import { createSimpleGeometryMap } from "$lib/components/Map/MapUtils";
  import { formatDate, formatDateTime } from "$lib/utils/dates";
  import type Map from "ol/Map";
  import { ChevronRight, CircleAlert, LoaderCircle, Play, RefreshCcw, ArrowUpRight } from "@lucide/svelte";
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
          study_name: "imagery-finder-study",
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

{#snippet crumbs()}
  <nav class="flex min-w-0 flex-wrap items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-haze" aria-label="Breadcrumb">
    <a href="/dashboard" class="hover:text-moon">Finders</a>
    <ChevronRight size={12} strokeWidth={1.5} class="text-shade" />
    <a href="/areas-of-interest" class="hover:text-moon">Areas</a>
    {#if finder?.location?.id}
      <ChevronRight size={12} strokeWidth={1.5} class="text-shade" />
      <a href="/areas-of-interest/{finder.location.id}" class="max-w-[14rem] truncate hover:text-moon">
        {finder.location.name || `Location #${finder.location.id}`}
      </a>
    {/if}
  </nav>
{/snippet}

{#if loading}
  <div class="flex w-full items-center justify-center py-16">
    <LoadingSpinner message="Loading imagery finder" />
  </div>
{:else if error && !finder}
  <div class="panel flex flex-col items-center px-6 py-14 text-center">
    <CircleAlert size={28} strokeWidth={1.25} class="mb-4 text-rust" />
    <h2 class="font-display text-3xl text-moon">Finder unavailable</h2>
    <p class="mt-2 mb-6 max-w-md text-sm text-haze">{error}</p>
    <a href="/dashboard" class="btn">Back to finders</a>
  </div>
{:else if finder}
  <div class="min-w-0 space-y-8">
    <header class="page-head">
      <div class="min-w-0 flex-1">
        {@render crumbs()}
        <h1 class="truncate">{finder.name}</h1>
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <StatusBadge status={finder.is_active ? "ACTIVE" : "INACTIVE"} size="sm" />
          <span class="readout text-xs text-dust">
            {formatDate(finder.start_date)} <span class="text-shade">→</span> {formatDate(finder.end_date)}
          </span>
          <span class="chip">
            {finder?.geometry?.type || finder?.location?.geometry?.type || "Unknown"}
          </span>
        </div>
      </div>

      <button onclick={handleExecuteStudy} disabled={executing} class="btn btn-primary shrink-0">
        {#if executing}
          <LoaderCircle size={14} strokeWidth={1.5} class="animate-spin" />
          <span>Executing</span>
        {:else}
          <Play size={14} strokeWidth={1.5} />
          <span>Execute study</span>
        {/if}
      </button>
    </header>

    {#if error}
      <div class="flex items-start gap-3 rounded-md border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust" role="alert">
        <CircleAlert size={16} strokeWidth={1.5} class="mt-0.5 shrink-0" />
        <p>{error}</p>
      </div>
    {/if}

    <section class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <!-- Left: Parameters -->
      <div class="space-y-6">
        <div>
          <p class="eyebrow mb-3">Summary</p>
          <dl class="flex">
            <div class="stat">
              <dt class="eyebrow">Studies</dt>
              <dd class="stat-value">{finder.studies?.length || 0}</dd>
            </div>
            <div class="stat">
              <dt class="eyebrow">Finder ID</dt>
              <dd class="stat-value font-mono text-2xl tabular-nums">{finder.id}</dd>
            </div>
          </dl>
        </div>

        {#if finder.rules && Object.keys(finder.rules).length > 0}
          <div>
            <p class="eyebrow mb-3">Search parameters</p>
            <div class="flex flex-wrap gap-2">
              {#each Object.entries(JSON.parse(finder.rules)) as [key, value]}
                {#if value !== null}
                  <span class="chip normal-case tracking-normal">
                    <span class="text-haze">{key}</span>
                    <span class="readout text-moon">{value}</span>
                  </span>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Right: Map -->
      <div class="min-w-0">
        <p class="eyebrow mb-3">Area of interest</p>
        <div class="aoi-map-container map-frame" bind:this={mapElement}></div>
      </div>
    </section>

    <!-- Study Runs -->
    <section class="panel">
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div class="flex items-baseline gap-3">
          <h2 class="font-display text-2xl text-moon">Study runs</h2>
          <span class="readout text-xs text-haze">{finder.studies?.length || 0}</span>
        </div>
        <button
          onclick={() => loadFinder(true)}
          disabled={loading}
          class="btn btn-sm btn-quiet"
          title="Refresh study runs"
        >
          <RefreshCcw size={13} strokeWidth={1.5} class={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div class="px-2 pb-3">
        <PaginatedList
          items={finder.studies || []}
          itemsPerPage={5}
          emptyTitle="No study runs yet"
          emptyMessage="Execute a study to start searching public archives for imagery over this area."
        >
          {#snippet children(study: any)}
            <a
              href="/archive/finder/{finderId}/study/{study.study_name}/{study.id}"
              class="row flex items-center justify-between gap-4"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-5">
                <div class="w-32 shrink-0">
                  <StatusBadge status={study.status} size="sm" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm text-moon">{study.study_name}</p>
                  <p class="readout mt-0.5 text-[0.7rem] text-haze">
                    run {formatDateTime(study.created)}
                    <span class="text-shade">·</span>
                    {formatDate(finder.start_date)} → {formatDate(finder.end_date)}
                  </p>
                </div>
              </div>
              <span class="flex shrink-0 items-center gap-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] {study.status === 'COMPLETED' ? 'text-moon' : 'text-haze'}">
                View <ArrowUpRight size={13} strokeWidth={1.5} />
              </span>
            </a>
          {/snippet}
        </PaginatedList>
      </div>
    </section>
  </div>
{/if}

<style>
  .aoi-map-container {
    height: 280px;
    width: 100%;
  }
</style>
