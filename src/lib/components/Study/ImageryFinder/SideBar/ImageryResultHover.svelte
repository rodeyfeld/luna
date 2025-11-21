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
    <div class="card">
      {#if result.thumbnail}
        <img
          class="thumb"
          src={result.thumbnail}
          alt={`Imagery preview ${result.external_id ?? result.id}`}
          loading="lazy"
        />
      {:else}
        <div class="thumb thumb--placeholder">
          <span>No preview</span>
        </div>
      {/if}

      <div class="meta">
        <p class="meta-title">{result.collection || "Unknown collection"}</p>
        <p class="meta-subtitle">
          #{result.external_id || result.id}
        </p>
        <dl class="meta-grid">
          <div>
            <dt>Sensor</dt>
            <dd>{result.sensor?.name || "—"}</dd>
          </div>
          <div>
            <dt>Window</dt>
            <dd>
              <span>{formatDate(result.start_date)}</span>
              <span class="sep">→</span>
              <span>{formatDate(result.end_date)}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  {:else}
    <div class="card card--empty">
      Hover over a result to preview imagery details.
    </div>
  {/if}
</div>

<style>
  .popup {
    position: absolute;
    min-width: 280px;
    max-width: 320px;
    pointer-events: none;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(10, 12, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0.75rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
    padding: 1rem;
  }

  .card--empty {
    color: #d0d7e3;
    font-size: 0.875rem;
  }

  .thumb {
    width: 100%;
    border-radius: 0.5rem;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
  }

  .thumb--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .meta-title {
    font-weight: 600;
    color: white;
  }

  .meta-subtitle {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .meta-grid {
    display: grid;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.85);
  }

  dt {
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.15rem;
  }

  dd {
    margin: 0;
  }

  .sep {
    opacity: 0.6;
    margin: 0 0.25rem;
  }
</style>


