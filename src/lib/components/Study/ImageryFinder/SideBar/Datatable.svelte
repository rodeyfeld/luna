<script lang="ts">
  import { createEventDispatcher } from "svelte";

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

  function handleSelect(result: ArchiveLookupResult) {
    dispatch("resultSelect", { result });
  }
</script>

{#if !data?.length}
  <div
    class="p-6 text-center border border-dashed border-surface-700 rounded-xl bg-surface-900/30"
  >
    <p class="text-surface-100 font-semibold mb-1">No imagery found</p>
    <p class="text-surface-400 text-sm">
      Execute the study again or adjust your finder parameters to view results.
    </p>
  </div>
{:else}
  <div
    class="bg-surface-800/40 rounded-xl border border-surface-700 overflow-hidden"
  >
    <table class="w-full text-sm border-collapse-separate border-spacing-0">
      <thead
        class="bg-surface-800/60 text-left text-surface-400 uppercase text-2xs tracking-wider"
      >
        <tr>
          <th scope="col" class="px-2 py-2 font-semibold">Collection</th>
          <th scope="col" class="px-2 py-2 font-semibold">Sensor</th>
          <th scope="col" class="px-2 py-2 font-semibold">Window</th>
          <th scope="col" class="px-2 py-2 font-semibold sr-only">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data as result (result.id)}
          <tr
            class="border-t border-surface-700/70 transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/70 hover:bg-surface-700/40"
            tabindex="0"
            role="button"
            aria-label={`Show imagery result ${result.id}`}
            onmouseenter={() => handleHover(result)}
            onfocus={() => handleHover(result)}
            onmouseleave={handleLeave}
            onblur={handleLeave}
            onclick={() => handleSelect(result)}
          >
            <td class="px-2 py-2 align-middle">
              <div class="flex flex-col">
                <p class="font-semibold text-surface-100 text-xs">
                  {result.collection || "Unknown"}
                </p>
                <p class="text-2xs text-surface-400">
                  {result.provider || "—"}
                </p>
              </div>
            </td>
            <td class="px-2 py-2 align-middle">
              <div class="flex flex-col gap-0.5">
                <span
                  class="inline-flex items-center w-fit px-1.5 py-0.5 rounded-full text-2xs bg-primary-500/15 text-primary-200 border border-primary-500/30"
                >
                  {result.sensor?.name || "—"}
                </span>
                <span class="text-2xs text-surface-400">
                  {result.sensor?.technique || "—"}
                </span>
              </div>
            </td>
            <td class="px-2 py-2 align-middle">
              <div class="flex flex-col text-2xs text-surface-200">
                <span>{formatDate(result.start_date)}</span>
                <span>{formatDate(result.end_date)}</span>
              </div>
            </td>
            <td class="px-2 py-2 align-middle">
              <button
                type="button"
                class="btn btn-xs variant-soft-primary text-2xs px-2 py-1"
                onclick={(event) => {
                  event.stopPropagation();
                  handleSelect(result);
                }}
                aria-label="Preview imagery thumbnail"
              >
                View
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
