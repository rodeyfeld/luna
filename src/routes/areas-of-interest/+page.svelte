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
  <SectionPanel variant="hero">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold mb-2">Areas of Interest</h1>
        <p class="text-surface-300">
          Draw new areas or select from your saved library
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class={`btn btn-sm ${mode === 'create' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
          onclick={() => (mode = 'create')}
        >
          Create New
        </button>
        <button
          type="button"
          class={`btn btn-sm ${mode === 'library' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
          onclick={() => (mode = 'library')}
        >
          Library ({geometries.length})
        </button>
      </div>
    </div>
  </SectionPanel>

  {#if mode === "create"}
    <SectionPanel>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Draw Area of Interest</h2>
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
            Point
          </button>
        </div>
      </div>

      <GeometryEditor
        bind:geometry={geometryDraft}
        bind:drawMode
        height="500px"
        onchange={handleGeometryChange}
      />

      <div class="space-y-4 mt-6">
        <label class="label">
          <span>Name</span>
          <input
            class="input"
            placeholder="e.g., Downtown Area"
            bind:value={geometryName}
          />
        </label>

        {#if error}
          <div class="text-sm text-error-500">{error}</div>
        {/if}
        {#if success}
          <div class="text-sm text-success-500">{success}</div>
        {/if}

        <button
          class="btn variant-filled-primary"
          onclick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Area of Interest"}
        </button>
      </div>
    </SectionPanel>
  {/if}

  {#if mode === "library"}
    <SectionPanel>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Saved Areas</h2>
        <button class="btn btn-sm variant-ghost-surface" onclick={loadGeometries}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {#if loading}
        <LoadingSpinner />
      {:else if geometries.length === 0}
        <div class="text-center py-12">
          <div class="text-6xl mb-4 opacity-20">🗺️</div>
          <p class="text-surface-400 mb-2">No areas saved</p>
          <p class="text-sm text-surface-500">
            Create your first area to get started
          </p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each geometries as geometryItem}
            <a
              href={`/areas-of-interest/${encodeURIComponent(String(geometryItem.id))}`}
              class="tile flex items-center justify-between"
            >
              <div>
                <p class="font-semibold">{geometryItem.name}</p>
                <p class="text-sm text-surface-500">
                  {geometryItem.created ? new Date(geometryItem.created).toLocaleDateString() : "—"}
                </p>
              </div>
              <svg class="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          {/each}
        </div>
      {/if}
    </SectionPanel>
  {/if}

</div>