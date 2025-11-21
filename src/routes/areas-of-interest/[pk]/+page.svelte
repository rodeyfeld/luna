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
    <SectionPanel variant="hero" padding="px-4 sm:px-12 py-16">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="space-y-3">
            <p class="uppercase tracking-[0.35em] text-xs text-surface-300/70">Area of Interest</p>
            <div class="space-y-2">
              <h1 class="text-4xl font-semibold">{geometryRecord.name}</h1>
              <p class="text-surface-200/80">
                Review this saved area of interest, preview it on the map, and launch workflows that rely on a
                precise outline.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <a class="btn variant-ghost-surface" href="/areas-of-interest">Back to Areas of Interest</a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {#each metadataRows as row}
            <div class="stat-card">
              <p class="text-xs uppercase tracking-[0.35em] text-surface-400/80">{row.label}</p>
              <p class="text-lg font-semibold text-surface-50">{row.value}</p>
            </div>
          {/each}
        </div>
      </div>
    </SectionPanel>

    <SectionPanel className="space-y-5">
      <div>
        <h2 class="text-2xl font-bold mb-4">Available Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href={`/archive/create?geometryId=${encodeURIComponent(String(geometryRecord.id))}`}
            class="tile hover-lift flex flex-col gap-2 text-left"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold">Run Imagery Finder</p>
                <p class="text-xs text-surface-500">Search satellite archives</p>
              </div>
            </div>
          </a>
          
          <div class="tile flex flex-col gap-2 opacity-50 cursor-not-allowed">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                <svg class="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="font-semibold">Create Tasking Order</p>
                <p class="text-xs text-surface-500">Coming soon</p>
              </div>
            </div>
          </div>

          <div class="tile flex flex-col gap-2 opacity-50 cursor-not-allowed">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                <svg class="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold">Run Analysis</p>
                <p class="text-xs text-surface-500">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionPanel>

    {#if finders.length > 0}
    <SectionPanel className="space-y-5">
      <div>
        <h2 class="text-2xl font-bold mb-4">Imagery Finders Using This AOI</h2>
        <p class="text-sm text-surface-500 mb-4">
          Archive searches that have been run on this area of interest
        </p>
        <div class="space-y-3">
          {#each finders as finder}
            <a
              href={`/archive/finder/${finder.id}`}
              class="tile hover-lift flex items-center justify-between"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="badge {finder.is_active ? 'variant-filled-success' : 'variant-soft-surface'}">
                    {finder.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <h3 class="font-semibold text-lg">{finder.name}</h3>
                </div>
                <div class="flex items-center gap-4 text-sm text-surface-500">
                  <span>
                    {formatDate(finder.start_date)} - {formatDate(finder.end_date)}
                  </span>
                  {#if finder.studies && finder.studies.length > 0}
                    <span>•</span>
                    <span>{finder.studies.length} {finder.studies.length === 1 ? 'study' : 'studies'}</span>
                  {/if}
                </div>
              </div>
              <svg class="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          {/each}
        </div>
      </div>
    </SectionPanel>
    {/if}

    <SectionPanel className="space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">AOI Preview</h2>
        <span class="text-sm text-surface-400">
          {geometryPreview ? `Type: ${geometryPreview.type}` : "AOI unavailable"}
        </span>
      </div>
      {#if geometryPreview}
        <GeometryEditor geometry={geometryPreview} height="520px" showToolbar={false} />
      {:else}
        <div class="tile text-sm text-surface-400">
          This area of interest could not be parsed. Try recreating it from the library list.
        </div>
      {/if}
    </SectionPanel>

    <SectionPanel>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">AOI GeoJSON</h3>
          <span class="text-xs text-surface-500">For quick copying into other tools</span>
        </div>
        <pre class="code-block">{JSON.stringify(geometryPreview ?? geometryRecord.geometry, null, 2)}</pre>
      </div>
    </SectionPanel>
  {:else}
    <SectionPanel variant="hero" padding="px-4 sm:px-12 py-16">
      <div class="space-y-6 text-center">
        <p class="uppercase tracking-[0.4em] text-xs text-surface-400/80">Area of Interest</p>
        <h1 class="text-4xl font-semibold">Area unavailable</h1>
        <p class="text-surface-300/80 max-w-2xl mx-auto">
          {loadError ?? "We couldn't find that area of interest in the current library. It might have been removed or renamed."}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a class="btn variant-filled-primary" href="/areas-of-interest">Back to Areas of Interest</a>
        </div>
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

