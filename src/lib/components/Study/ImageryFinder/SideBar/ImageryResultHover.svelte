<script lang="ts">
  import { onMount } from 'svelte';
  import type Overlay from 'ol/Overlay';
  import type { ArchiveLookupResult } from "./Datatable.svelte";

  interface Props {
    overlay?: Overlay;
    result: ArchiveLookupResult | null;
  }

  let { overlay, result }: Props = $props();
  let popupElement: HTMLDivElement;

  onMount(() => {
    if (overlay && popupElement) {
      overlay.setElement(popupElement);
    }
  });

  function formatDate(value?: string) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  }
</script>

<div id="image-popup" class="popup" aria-live="polite" bind:this={popupElement}>
  {#if result}
    <div class="panel flex flex-col gap-3 p-3">
      {#if result.thumbnail}
        <img
          class="thumb"
          src={result.thumbnail}
          alt={`Imagery preview ${result.external_id ?? result.id}`}
          loading="lazy"
        />
      {:else}
        <div class="thumb thumb--placeholder eyebrow">No preview</div>
      {/if}

      <div class="min-w-0">
        <p class="truncate text-sm text-moon">{result.collection || "Unknown collection"}</p>
        <p class="readout mt-0.5 truncate text-[0.68rem] text-haze">
          #{result.external_id || result.id}
        </p>
        <dl class="mt-3 grid gap-2 border-t border-line pt-3 text-xs">
          <div class="flex items-baseline justify-between gap-3">
            <dt class="eyebrow">Sensor</dt>
            <dd class="text-dust">{result.sensor?.name || "—"}</dd>
          </div>
          <div>
            <dt class="eyebrow mb-1">Window</dt>
            <dd class="readout text-[0.7rem] text-dust">
              <span>{formatDate(result.start_date)}</span>
              <span class="mx-1 text-shade">→</span>
              <span>{formatDate(result.end_date)}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  {:else}
    <div class="panel p-3 text-xs text-haze">
      Hover over a result to preview imagery details.
    </div>
  {/if}
</div>

<style>
  .popup {
    position: absolute;
    width: 280px;
    max-width: calc(100vw - 2rem);
    pointer-events: none;
  }

  .thumb {
    width: 100%;
    max-height: 180px;
    border-radius: 0.3rem;
    object-fit: cover;
    border: 1px solid var(--color-line);
    background: var(--color-night);
  }

  .thumb--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }
</style>
