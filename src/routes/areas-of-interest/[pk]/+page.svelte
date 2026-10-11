<script lang="ts">
  import EmptyState from "$lib/components/shared/EmptyState.svelte";
  import { ArrowLeft, ChevronRight, ScanSearch, Wind } from "@lucide/svelte";
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
    <header class="page-head animate-fadeIn">
      <div class="min-w-0">
        <p class="eyebrow">
          <a href="/areas-of-interest" class="transition-colors hover:text-moon">Atlas · Areas</a>
          <span class="text-shade"> / </span>
          <span class="readout">No. {geometryRecord.id}</span>
        </p>
        <h1 class="break-words">{geometryRecord.name}</h1>
        <p class="readout text-sm">{geometryPreview ? geometryPreview.type : "Area of interest"}</p>
      </div>
      <a class="btn btn-quiet shrink-0" href="/areas-of-interest">
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back
      </a>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section class="animate-fadeIn stagger-1 lg:col-span-2">
        {#if geometryPreview}
          <GeometryEditor geometry={geometryPreview} height="500px" showToolbar={false} />
        {:else}
          <div class="map-frame flex h-[300px] items-center justify-center text-sm text-haze">
            Unable to display geometry
          </div>
        {/if}
      </section>

      <aside class="flex flex-col gap-6 animate-fadeIn stagger-2">
        <section class="panel">
          <p class="eyebrow border-b border-line px-5 py-3.5">Record</p>
          <dl>
            {#each metadataRows as row}
              <div class="flex items-baseline justify-between gap-4 border-b border-line px-5 py-2.5 last:border-b-0">
                <dt class="text-sm text-haze">{row.label}</dt>
                <dd class="readout truncate text-sm text-dust">{row.value}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <section class="panel">
          <p class="eyebrow border-b border-line px-5 py-3.5">Actions</p>
          <a
            href={`/archive/create?geometryId=${encodeURIComponent(String(geometryRecord.id))}`}
            class="row flex items-center gap-3"
          >
            <ScanSearch size={16} strokeWidth={1.5} class="shrink-0 text-sodium" />
            <span class="flex-1 text-sm font-medium text-moon">Create imagery finder</span>
            <ChevronRight size={16} strokeWidth={1.5} class="shrink-0 text-shade" />
          </a>
          <div class="flex items-center gap-3 px-[1.1rem] py-[0.95rem] text-shade" aria-disabled="true">
            <Wind size={16} strokeWidth={1.5} class="shrink-0" />
            <span class="flex-1 text-sm">Create wind speed</span>
            <span class="chip shrink-0 text-shade">Soon</span>
          </div>
        </section>
      </aside>
    </div>

    {#if finders.length > 0}
      <section class="panel animate-fadeIn stagger-3">
        <div class="flex items-center justify-between border-b border-line px-5 py-3.5">
          <p class="eyebrow">Imagery finders</p>
          <span class="readout text-xs text-haze">{finders.length}</span>
        </div>
        <div class="p-2 sm:p-3">
          {#each finders as finder}
            <a href={`/archive/finder/${finder.id}`} class="row flex items-center justify-between gap-4">
              <div class="min-w-0">
                <div class="mb-1 flex items-center gap-2.5">
                  <span class="truncate font-medium text-moon">{finder.name}</span>
                  {#if finder.is_active}
                    <span class="chip shrink-0 text-sage">Active</span>
                  {/if}
                </div>
                <div class="readout flex flex-wrap gap-x-3 text-xs text-haze">
                  <span>{formatDate(finder.start_date)} → {formatDate(finder.end_date)}</span>
                  {#if finder.studies && finder.studies.length > 0}
                    <span>{finder.studies.length} {finder.studies.length === 1 ? 'study' : 'studies'}</span>
                  {/if}
                </div>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} class="shrink-0 text-shade" />
            </a>
          {/each}
        </div>
      </section>
    {/if}

    <section class="panel animate-fadeIn stagger-4">
      <p class="eyebrow border-b border-line px-5 py-3.5">GeoJSON</p>
      <pre class="code-block readout">{JSON.stringify(geometryPreview ?? geometryRecord.geometry, null, 2)}</pre>
    </section>
  {:else}
    <section class="panel animate-fadeIn">
      <EmptyState
        title="Area not found"
        description={loadError ?? "This area of interest doesn't exist or has been removed."}
      >
        {#snippet action()}
          <a class="btn btn-primary" href="/areas-of-interest">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to library
          </a>
        {/snippet}
      </EmptyState>
    </section>
  {/if}
</div>

<style>
  .code-block {
    max-height: 24rem;
    overflow: auto;
    padding: 1.25rem;
    font-size: 0.78rem;
    line-height: 1.6;
    color: var(--color-dust);
  }
</style>
