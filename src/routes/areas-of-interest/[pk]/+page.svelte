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
            <a
              class="btn variant-filled-primary"
              href={`/archive/create?geometryId=${encodeURIComponent(String(geometryRecord.id))}`}
            >
              Run Imagery Finder
            </a>
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

