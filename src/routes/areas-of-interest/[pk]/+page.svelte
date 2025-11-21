<script lang="ts">
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
  import GeometryEditor from "$lib/components/shared/GeometryEditor.svelte";
  import { normalizeGeometry, type GeoJSONGeometry } from "$lib/utils/geometry";
  import type { StoredGeometry } from "$lib/types/imagery";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const geometryRecord = (data.geometry ?? null) as StoredGeometry | null;
  const finders = (data.finders ?? []) as any[];
  const loadError = data.error as string | null;

  function parseGeometry(rawGeometry: StoredGeometry["geometry"]): GeoJSONGeometry | null {
    if (!rawGeometry) return null;
    try {
      const parsed = typeof rawGeometry === "string" ? JSON.parse(rawGeometry) : rawGeometry;
      return normalizeGeometry(parsed);
    } catch (err) {
      console.error("Unable to parse geometry", err);
      return null;
    }
  }

  function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  const geometryPreview = geometryRecord ? parseGeometry(geometryRecord.geometry) : null;
  const metadataRows = geometryRecord
    ? [
        { label: "Created", value: formatDate(geometryRecord.created) },
        {
          label: "Last Updated",
          value: formatDate(geometryRecord.modified ?? geometryRecord.updated ?? geometryRecord.created),
        },
        { label: "Identifier", value: String(geometryRecord.id) },
      ]
    : [];
</script>

<div class="page-stack">
  {#if geometryRecord}
    <SectionPanel variant="hero">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold mb-2">{geometryRecord.name}</h1>
          <p class="text-surface-300">
            {geometryPreview ? geometryPreview.type : "Area of Interest"}
          </p>
        </div>
        <a class="btn variant-ghost-surface" href="/areas-of-interest">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </a>
      </div>
    </SectionPanel>

    <SectionPanel>
      <h2 class="text-xl font-semibold mb-4">Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a
          href={`/archive/create?geometryId=${encodeURIComponent(String(geometryRecord.id))}`}
          class="tile flex items-center gap-3"
        >
          <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="font-medium">Create Imagery Finder</span>
        </a>
        <div class="tile flex items-center gap-3 opacity-40">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="font-medium">Create Tasking Order <span class="text-xs text-surface-500">(coming soon)</span></span>
        </div>
      </div>
    </SectionPanel>

    {#if finders.length > 0}
    <SectionPanel>
      <h2 class="text-xl font-semibold mb-4">Imagery Finders ({finders.length})</h2>
      <div class="space-y-3">
        {#each finders as finder}
          <a
            href={`/archive/finder/${finder.id}`}
            class="tile flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">{finder.name}</span>
                {#if finder.is_active}
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                {/if}
              </div>
              <div class="text-sm text-surface-500">
                {formatDate(finder.start_date)} - {formatDate(finder.end_date)}
                {#if finder.studies && finder.studies.length > 0}
                  • {finder.studies.length} {finder.studies.length === 1 ? 'study' : 'studies'}
                {/if}
              </div>
            </div>
            <svg class="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/each}
      </div>
    </SectionPanel>
    {/if}

    <SectionPanel>
      <h2 class="text-xl font-semibold mb-4">Map Preview</h2>
      {#if geometryPreview}
        <GeometryEditor geometry={geometryPreview} height="500px" showToolbar={false} />
      {:else}
        <div class="text-center py-8 text-surface-500">
          Unable to display geometry
        </div>
      {/if}
    </SectionPanel>

    <SectionPanel>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold">GeoJSON</h3>
      </div>
      <pre class="code-block">{JSON.stringify(geometryPreview ?? geometryRecord.geometry, null, 2)}</pre>
    </SectionPanel>
  {:else}
    <SectionPanel variant="hero">
      <div class="text-center py-12">
        <div class="text-6xl mb-4 opacity-20">🗺️</div>
        <h1 class="text-2xl font-bold mb-2">Area not found</h1>
        <p class="text-surface-400 mb-6">
          {loadError ?? "This area of interest doesn't exist or has been removed."}
        </p>
        <a class="btn variant-filled-primary" href="/areas-of-interest">
          Back to Library
        </a>
      </div>
    </SectionPanel>
  {/if}
</div>

<style>
  .code-block {
    background: rgba(15, 23, 42, 0.65);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
  }
</style>

