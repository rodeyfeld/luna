<script lang="ts">
  import { onMount } from "svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
import GeometryEditor from "$lib/components/shared/GeometryEditor.svelte";
import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
import { normalizeGeometry, type GeoJSONGeometry } from "$lib/utils/geometry";
  import type { StoredGeometry } from "$lib/types/imagery";

  let loading = $state(true);
  let saving = $state(false);
  let error = $state<string | null>(null);
  let success = $state<string | null>(null);

let geometries = $state<StoredGeometry[]>([]);
let mode = $state<"create" | "library">("library");
let geometryDraft = $state<GeoJSONGeometry | null>(null);
  let drawMode = $state<"polygon" | "point">("polygon");
  let geometryName = $state("");

  onMount(async () => {
    await loadGeometries();
  });

  async function loadGeometries() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/imagery');
      
      if (!response.ok) {
        error = `Failed to load geometries: ${response.statusText}`;
        geometries = [];
      } else {
        const data = await response.json();
        geometries = data.results || [];
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load geometries';
      geometries = [];
    }
    
    loading = false;
  }

  async function handleSave() {
    const normalized = normalizeGeometry(geometryDraft);
    if (!normalized) {
      error = "Draw or select an area of interest before saving.";
      return;
    }
    if (!geometryName.trim()) {
      error = "Name your area of interest to reuse it later.";
      return;
    }
    saving = true;
    error = null;
    success = null;
    
    const payload = {
      name: geometryName.trim(),
      geometry: JSON.stringify(normalized),
    };
    
    try {
      const response = await fetch('/api/imagery/create', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      saving = false;
      
      if (!response.ok) {
        error = `Failed to save: ${response.statusText}`;
        return;
      }
      
      geometryName = "";
      geometryDraft = null;
      success = "Saved area of interest for reuse.";
      await loadGeometries();
    } catch (err) {
      saving = false;
      error = err instanceof Error ? err.message : 'Failed to save';
    }
  }

  function handleGeometryChange(event: CustomEvent<{ geometry: GeoJSONGeometry }>) {
    geometryDraft = normalizeGeometry(event.detail.geometry);
    if (success) success = null;
  }

</script>

<div class="page-stack">
  <SectionPanel variant="hero" padding="px-4 sm:px-12 py-16">
    <div class="flex flex-col gap-12">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-14">
        <div class="space-y-6 max-w-3xl">
          <div class="flex flex-wrap items-center gap-3">
            <span class="badge variant-soft-primary text-[0.65rem] uppercase tracking-[0.4em]">
              Areas of Interest
            </span>
            <span class="text-xs text-surface-400/90">AOI workflows for archive + tasking</span>
          </div>
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-5xl font-semibold leading-tight">
              Create or Reuse Areas of Interest
            </h1>
            <p class="text-surface-200/80 text-base lg:text-lg">
              Start by defining a new area of interest or instantly jump into your saved library.
              Every AOI can kick off archive finders, new collections, and future studies.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs sm:text-sm text-surface-200/80">
            <span class="badge variant-soft">Precision AOIs</span>
            <span class="badge variant-soft">Archive Finder Ready</span>
            <span class="badge variant-soft">Shared Team Library</span>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 w-full sm:max-w-2xl">
          <button
            type="button"
            class={`tile text-left transition-smooth ${mode === 'create' ? 'border-primary-500 bg-primary-500/10' : ''}`}
            onclick={() => (mode = 'create')}
          >
            <p class="text-sm text-primary-200 mb-1">Create</p>
            <p class="text-lg font-semibold">New AOI</p>
            <p class="text-xs text-surface-400 mt-1">Draw on the map and save for reuse.</p>
          </button>
          <button
            type="button"
            class={`tile text-left transition-smooth ${mode === 'library' ? 'border-primary-500 bg-primary-500/10' : ''}`}
            onclick={() => (mode = 'library')}
          >
            <p class="text-sm text-primary-200 mb-1">Library</p>
            <p class="text-lg font-semibold">Saved AOIs</p>
            <p class="text-xs text-surface-400 mt-1">Launch archive finders on stored areas.</p>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div class="stat-card" data-variant="accent">
          <span class="text-xs uppercase tracking-[0.35em] text-primary-50/70">Library Size</span>
          <p class="text-4xl lg:text-5xl font-bold">{geometries.length}</p>
          <span class="text-sm text-surface-50/80">
            {geometries.length
              ? `${geometries.length === 1 ? "AOI" : "AOIs"} ready for reuse`
              : "Save your first AOI to unlock archive finders."}
          </span>
        </div>
        <div class="stat-card">
          <span class="text-xs uppercase tracking-[0.35em] text-surface-300/80">Workflow Focus</span>
          <p class="text-lg font-semibold">
            {mode === "create" ? "Sketch & Save" : "Launch from Library"}
          </p>
          <span class="text-sm text-surface-300/75">
            {mode === "create"
              ? "Draw a fresh AOI or import GeoJSON, then keep it ready for future orders."
              : "Select a saved AOI, run archive finders, or kick off new studies instantly."}
          </span>
        </div>
      </div>
    </div>
  </SectionPanel>

  {#if mode === "create"}
    <SectionPanel className="space-y-6">
      <h2 class="text-xl font-semibold">Define Area of Interest</h2>
      <GeometryEditor
        bind:geometry={geometryDraft}
        bind:drawMode
        height="500px"
        onchange={handleGeometryChange}
      />
      {#if geometryDraft}
        <div class="alert variant-filled-success">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div class="alert-message">
            <p>AOI ready ({geometryDraft.type}).</p>
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div class="space-y-4">
          <label class="label">
            <span>AOI Name</span>
            <input
              class="input"
              placeholder="e.g., Downtown Forestry Zone"
              bind:value={geometryName}
            />
          </label>
          {#if error}
            <aside class="alert variant-filled-error">
              <div class="alert-message">
                <p>{error}</p>
              </div>
            </aside>
          {/if}
          {#if success}
            <aside class="alert variant-filled-success">
              <div class="alert-message">
                <p>{success}</p>
              </div>
            </aside>
          {/if}
          <button
            class="btn variant-filled-primary w-full"
            onclick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save AOI"}
          </button>
        </div>
        <div class="space-y-3">
          <p class="text-sm text-surface-500">
            Saved AOIs appear in the library and archive finder creation flows. Use Quick Point to auto-build a small square AOI or switch to polygon for precise drawing.
          </p>
          <div class="btn-group">
            <button
              type="button"
              class={`btn btn-sm ${drawMode === 'polygon' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
              onclick={() => (drawMode = 'polygon')}
            >
              Polygon
            </button>
            <button
              type="button"
              class={`btn btn-sm ${drawMode === 'point' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
              onclick={() => (drawMode = 'point')}
            >
              Quick Point
            </button>
          </div>
        </div>
      </div>
    </SectionPanel>
  {/if}

  {#if mode === "library"}
    <SectionPanel variant="muted">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">AOI Library</h2>
        <button class="btn btn-sm variant-ghost-surface" onclick={loadGeometries}>
          Refresh
        </button>
      </div>

      {#if loading}
        <LoadingSpinner message="Loading areas of interest..." />
      {:else if geometries.length === 0}
        <div class="text-center py-12">
          <div class="text-5xl mb-4 opacity-30">🗺️</div>
          <p class="text-lg text-surface-400 mb-4">No AOIs stored yet.</p>
          <p class="text-sm text-surface-500">
            Use the Create flow to define your first reusable AOI.
          </p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each geometries as geometryItem}
            <div class="tile flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="font-semibold">{geometryItem.name}</p>
                <p class="text-sm text-surface-500">
                  Saved {geometryItem.created ? new Date(geometryItem.created).toLocaleString() : "—"}
                </p>
              </div>
              <div>
                <a
                  class="btn btn-sm variant-filled-primary"
                  href={`/areas-of-interest/${encodeURIComponent(String(geometryItem.id))}`}
                >
                  Select
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </SectionPanel>
  {/if}

</div>