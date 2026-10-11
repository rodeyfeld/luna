<script lang="ts">
  import { onMount } from "svelte";
  import GeometryEditor from "$lib/components/shared/GeometryEditor.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import MiniMap from "$lib/components/shared/MiniMap.svelte";
  import PaginatedList from "$lib/components/shared/PaginatedList.svelte";
  import { normalizeGeometry, type GeoJSONGeometry } from "$lib/utils/geometry";
  import { formatDateTime } from "$lib/utils/dates";
  import type { StoredGeometry } from "$lib/types/imagery";
  import { ChevronRight, Plus, RefreshCcw } from "@lucide/svelte";

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
        geometries = Array.isArray(data) ? data : [];
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
  <header class="page-head animate-fadeIn">
    <div class="min-w-0">
      <p class="eyebrow">Atlas · Areas</p>
      <h1>Areas of interest</h1>
      <p>Draw new areas or pick from your saved library.</p>
    </div>
    <div class="seg shrink-0">
      <button type="button" aria-pressed={mode === 'library'} onclick={() => (mode = 'library')}>
        Library <span class="readout ml-1 text-haze">{geometries.length}</span>
      </button>
      <button type="button" aria-pressed={mode === 'create'} onclick={() => (mode = 'create')}>
        Draw new
      </button>
    </div>
  </header>

  {#if mode === "create"}
    <section class="panel p-5 sm:p-6 animate-fadeIn">
      <div class="mb-5">
        <p class="eyebrow">New area</p>
        <h2 class="mt-1.5 font-display text-3xl text-moon">Draw an area of interest</h2>
      </div>

      <GeometryEditor
        bind:geometry={geometryDraft}
        bind:drawMode
        height="500px"
        onchange={handleGeometryChange}
      />

      <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label class="field flex-1">
          <span>Name</span>
          <input
            class="input"
            placeholder="e.g. Downtown area"
            bind:value={geometryName}
          />
        </label>

        <button
          class="btn btn-primary"
          onclick={handleSave}
          disabled={saving}
        >
          <Plus size={14} strokeWidth={1.5} />
          {saving ? "Saving…" : "Save area"}
        </button>
      </div>

      {#if error}
        <p class="mt-3 text-sm text-rust">{error}</p>
      {/if}
      {#if success}
        <p class="mt-3 text-sm text-sage">{success}</p>
      {/if}
    </section>
  {/if}

  {#if mode === "library"}
    <section class="panel animate-fadeIn">
      <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <p class="eyebrow">Saved areas</p>
        <button
          class="btn btn-sm btn-quiet btn-icon"
          onclick={loadGeometries}
          aria-label="Refresh saved areas"
          title="Refresh saved areas"
        >
          <RefreshCcw size={14} strokeWidth={1.5} />
        </button>
      </div>

      {#if loading}
        <LoadingSpinner message="Loading areas" />
      {:else}
        {#if error}
          <p class="px-5 pt-4 text-sm text-rust">{error}</p>
        {/if}
        <div class="p-2 sm:p-3">
          <PaginatedList
            items={geometries}
            itemsPerPage={10}
            emptyTitle="No areas saved yet"
            emptyMessage="Draw your first area to get started."
          >
            {#snippet emptyAction()}
              <button class="btn btn-primary" onclick={() => (mode = 'create')}>
                <Plus size={14} strokeWidth={1.5} />
                Draw new
              </button>
            {/snippet}
            {#snippet children(geometryItem)}
              <a
                href={`/areas-of-interest/${encodeURIComponent(String(geometryItem.id))}`}
                class="row flex items-center gap-4"
              >
                <MiniMap geometry={geometryItem.geometry} width="96px" height="64px" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium text-moon">{geometryItem.name}</p>
                  <p class="readout mt-1 text-xs text-haze">
                    {formatDateTime(geometryItem.created)}
                  </p>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} class="shrink-0 text-shade" />
              </a>
            {/snippet}
          </PaginatedList>
        </div>
      {/if}
    </section>
  {/if}
</div>
