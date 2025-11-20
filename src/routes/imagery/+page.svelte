<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { createImagery, getImagery } from "$lib/api/augur";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
import GeometryEditor from "$lib/components/shared/GeometryEditor.svelte";
import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
import { normalizeGeometry, type GeoJSONGeometry } from "$lib/utils/geometry";

  type StoredGeometry = {
    id: string | number;
    name: string;
    geometry: any;
    created?: string;
    modified?: string;
    updated?: string;
    user_id?: number;
  };

  let loading = $state(true);
  let saving = $state(false);
  let error = $state<string | null>(null);
  let success = $state<string | null>(null);

let geometries = $state<StoredGeometry[]>([]);
let mode = $state<"create" | "library">("create");
let selectedGeometryId = $state<string>('');

let geometryDraft = $state<GeoJSONGeometry | null>(null);
  let drawMode = $state<"polygon" | "point">("polygon");
  let geometryName = $state("");

  onMount(async () => {
    await loadGeometries();
  });

  async function loadGeometries() {
    loading = true;
    error = null;
    const response = await getImagery();
    if (response.error) {
      error = response.error;
      geometries = [];
    } else {
      geometries = (response.data as StoredGeometry[]) ?? [];
    }
    loading = false;
  }

  async function handleSave() {
    const normalized = normalizeGeometry(geometryDraft);
    if (!normalized) {
      error = "Draw or select a geometry before saving.";
      return;
    }
    if (!geometryName.trim()) {
      error = "Name your geometry to reuse it later.";
      return;
    }
    saving = true;
    error = null;
    success = null;
    const payload = {
      name: geometryName.trim(),
      geometry: JSON.stringify(normalized),
    };
    const response = await createImagery(payload.geometry, payload.name);
    saving = false;
    if (response.error) {
      error = response.error;
      return;
    }
    geometryName = "";
    geometryDraft = null;
    success = "Saved geometry for reuse.";
    await loadGeometries();
  }

  function handleGeometryChange(event: CustomEvent<{ geometry: GeoJSONGeometry }>) {
    geometryDraft = normalizeGeometry(event.detail.geometry);
    if (success) success = null;
  }

function viewGeometry(record: StoredGeometry) {
  const parsed =
    typeof record.geometry === "string"
      ? JSON.parse(record.geometry)
      : record.geometry;
  geometryDraft = normalizeGeometry(parsed);
  mode = "create";
}

function setSelectedGeometry(record: StoredGeometry) {
  selectedGeometryId = String(record.id);
}

function runImageryFinder(record: StoredGeometry) {
  goto(`/archive/create?geometryId=${record.id}`);
}

const selectedGeometry = $derived(() =>
  geometries.find((item) => String(item.id) === String(selectedGeometryId)) ?? null
);

const latestGeometryUpdated = $derived(() => {
  const latest = geometries[0]?.modified ?? geometries[0]?.updated;
  return latest ? new Date(latest).toLocaleDateString() : "—";
});
</script>

<div class="page-stack">
  <SectionPanel variant="hero" padding="px-4 sm:px-8 py-12">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p class="uppercase tracking-[0.3em] text-xs text-surface-300/70 mb-2">
            Imagery Requests
          </p>
          <h1 class="text-4xl font-bold">Create or Reuse Geometries</h1>
          <p class="text-surface-200/80 mt-2 max-w-2xl">
            Start by defining a new area of interest or jump into your existing geometry library.
            Every geometry can kick off archive finders and future studies instantly.
          </p>
        </div>
        <div class="grid sm:grid-cols-2 gap-3 w-full sm:max-w-xl">
          <button
            type="button"
            class={`tile text-left transition-smooth ${mode === 'create' ? 'border-primary-500 bg-primary-500/10' : ''}`}
            onclick={() => (mode = 'create')}
          >
            <p class="text-sm text-primary-200 mb-1">Create</p>
            <p class="text-lg font-semibold">New Geometry</p>
            <p class="text-xs text-surface-400 mt-1">Draw on the map and save for reuse.</p>
          </button>
          <button
            type="button"
            class={`tile text-left transition-smooth ${mode === 'library' ? 'border-primary-500 bg-primary-500/10' : ''}`}
            onclick={() => (mode = 'library')}
          >
            <p class="text-sm text-primary-200 mb-1">Library</p>
            <p class="text-lg font-semibold">Saved Geometries</p>
            <p class="text-xs text-surface-400 mt-1">Launch archive finders on stored AOIs.</p>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="stat-card" data-variant="accent">
          <p class="text-sm text-surface-300/80">Saved Geometries</p>
          <p class="text-3xl font-bold">{geometries.length}</p>
          <span class="text-xs text-surface-300/70">Ready for reuse</span>
        </div>
        <div class="stat-card">
          <p class="text-sm text-surface-300/80">Last Updated</p>
          <p class="text-lg font-semibold">{latestGeometryUpdated}</p>
          <span class="text-xs text-surface-300/70">Newest entry</span>
        </div>
      </div>
    </div>
  </SectionPanel>

  {#if mode === "create"}
    <SectionPanel className="space-y-6">
      <h2 class="text-xl font-semibold">Define Geometry</h2>
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
            <p>Geometry ready ({geometryDraft.type}).</p>
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div class="space-y-4">
          <label class="label">
            <span>Geometry Name</span>
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
            {saving ? "Saving..." : "Save Geometry"}
          </button>
        </div>
        <div class="space-y-3">
          <p class="text-sm text-surface-500">
            Saved geometries appear in the library and archive finder creation flows. Use Quick Point to auto-build a small square AOI or switch to polygon for precise drawing.
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
        <h2 class="text-2xl font-bold">Geometry Library</h2>
        <button class="btn btn-sm variant-ghost-surface" onclick={loadGeometries}>
          Refresh
        </button>
      </div>

      {#if loading}
        <LoadingSpinner message="Loading geometries..." />
      {:else if geometries.length === 0}
        <div class="text-center py-12">
          <div class="text-5xl mb-4 opacity-30">🗺️</div>
          <p class="text-lg text-surface-400 mb-4">No geometries stored yet.</p>
          <p class="text-sm text-surface-500">
            Use the Create flow to define your first reusable area.
          </p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each geometries as geometryItem}
            <div class="tile flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="font-semibold">{geometryItem.name}</p>
                <p class="text-sm text-surface-500">
                  Saved {geometryItem.created ? new Date(geometryItem.created).toLocaleDateString() : "—"}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  class={`btn btn-sm ${selectedGeometryId === String(geometryItem.id) ? 'variant-filled-primary' : 'variant-soft-surface'}`}
                  onclick={() => setSelectedGeometry(geometryItem)}
                >
                  {selectedGeometryId === String(geometryItem.id) ? 'Selected' : 'Select'}
                </button>
                <button class="btn btn-sm variant-ghost-surface" onclick={() => viewGeometry(geometryItem)}>
                  View in Editor
                </button>
                <button class="btn btn-sm variant-filled-primary" onclick={() => runImageryFinder(geometryItem)}>
                  Run Imagery Finder
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </SectionPanel>
  {/if}

  <SectionPanel>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Launch Studies</h2>
        {#if selectedGeometry}
          <span class="badge variant-soft-primary text-sm">Geometry: {selectedGeometry.name}</span>
        {:else}
          <span class="text-xs text-surface-500">Select a geometry from the library to enable studies.</span>
        {/if}
      </div>

      {#if selectedGeometry}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="tile space-y-3">
            <div>
              <p class="text-sm text-surface-400 uppercase tracking-[0.3em]">Available</p>
              <h3 class="text-xl font-semibold">Imagery Finder</h3>
              <p class="text-sm text-surface-500">
                Execute an archive search using {selectedGeometry.name}.
              </p>
            </div>
            <button class="btn variant-filled-primary w-full" onclick={() => runImageryFinder(selectedGeometry)}>
              Open Imagery Finder
            </button>
          </div>

          <div class="tile space-y-3 opacity-70">
            <div>
              <p class="text-sm text-surface-400 uppercase tracking-[0.3em]">Coming Soon</p>
              <h3 class="text-xl font-semibold">Wind Study</h3>
              <p class="text-sm text-surface-500">
                Analyze wind characteristics for the selected geometry.
              </p>
            </div>
            <button class="btn variant-soft-surface w-full" disabled>
              Wind Study (Coming Soon)
            </button>
          </div>
        </div>
      {:else}
        <div class="tile text-sm text-surface-400">
          No geometry selected. Choose one from the library to unlock studies.
        </div>
      {/if}
    </div>
  </SectionPanel>
</div>