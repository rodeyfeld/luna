<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Crosshair } from "@lucide/svelte";

  type Sensor = {
    name?: string;
    technique?: string;
  };

  export type ArchiveLookupResult = {
    id: number;
    external_id?: string;
    collection?: string;
    provider?: string;
    start_date?: string;
    end_date?: string;
    sensor?: Sensor;
    geometry?: Record<string, any>;
    thumbnail?: string;
    metadata?: string;
  };

  interface Props {
    data: ArchiveLookupResult[];
  }

  const dispatch = createEventDispatcher<{
    resultHover: { result: ArchiveLookupResult };
    resultLeave: void;
    resultSelect: { result: ArchiveLookupResult };
  }>();

  let { data }: Props = $props();

  function formatDate(value?: string) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return value;
    }
  }

  function truncateId(id?: string | number): string {
    if (!id) return "—";
    const str = String(id);
    return str.length > 4 ? `…${str.slice(-4)}` : str;
  }

  function handleHover(result: ArchiveLookupResult) {
    dispatch("resultHover", { result });
  }

  function handleLeave() {
    dispatch("resultLeave");
  }

  let selectedId = $state<number | null>(null);

  function handleSelect(result: ArchiveLookupResult) {
    selectedId = result.id;
    dispatch("resultSelect", { result });
  }
</script>

{#if !data?.length}
  <div class="px-6 py-10 text-center">
    <p class="font-display text-xl text-moon">No imagery found</p>
    <p class="mt-1 text-sm text-haze">
      Execute the study again or adjust your finder parameters to view results.
    </p>
  </div>
{:else}
  <table class="data-table">
    <thead>
      <tr>
        <th scope="col">Collection</th>
        <th scope="col">Sensor</th>
        <th scope="col">Window</th>
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      {#each data as result (result.id)}
        <tr
          class="cursor-pointer focus:outline-none focus-visible:bg-ink-2 {selectedId === result.id ? 'is-active' : ''}"
          tabindex="0"
          role="button"
          aria-label={`Show imagery result ${result.id}`}
          aria-pressed={selectedId === result.id}
          onmouseenter={() => handleHover(result)}
          onfocus={() => handleHover(result)}
          onmouseleave={handleLeave}
          onblur={handleLeave}
          onclick={() => handleSelect(result)}
        >
          <td class="min-w-0">
            <p class="max-w-[12rem] truncate text-xs text-moon">
              {result.collection || "Unknown"}
            </p>
            <p class="mt-0.5 text-[0.7rem] text-haze">{result.provider || "—"}</p>
          </td>
          <td>
            <span class="chip">{result.sensor?.name || "—"}</span>
            <p class="mt-1 text-[0.7rem] text-haze">{result.sensor?.technique || "—"}</p>
          </td>
          <td class="readout whitespace-nowrap text-[0.7rem] text-dust">
            <span class="block">{formatDate(result.start_date)}</span>
            <span class="block text-haze">{formatDate(result.end_date)}</span>
          </td>
          <td class="text-right">
            <button
              type="button"
              class="btn btn-sm btn-quiet btn-icon"
              onclick={(event) => {
                event.stopPropagation();
                handleSelect(result);
              }}
              aria-label="Zoom to imagery footprint"
              title="Zoom to footprint"
            >
              <Crosshair size={14} strokeWidth={1.5} />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
