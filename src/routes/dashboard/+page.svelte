<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";

  let imageryFinders = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;

    try {
      const response = await fetch('/api/archive');
      if (!response.ok) {
        error = `Failed to load finders: ${response.statusText}`;
        loading = false;
        return;
      }
      
      const data = await response.json();
      imageryFinders = data.results || [];
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load data";
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<div class="page-stack">
  <SectionPanel variant="hero">
    <div class="flex justify-between items-start gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-2">Imagery Finders</h1>
        <p class="text-surface-300">
          Manage and monitor your satellite imagery searches
        </p>
      </div>
      <button
        onclick={() => goto("/archive/create")}
        class="btn variant-filled-primary"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Finder</span>
      </button>
    </div>
  </SectionPanel>

  <SectionPanel>
    {#if error}
      <div class="text-center py-12">
        <div class="text-5xl mb-3 opacity-20">⚠️</div>
        <h3 class="text-lg font-semibold mb-2">Connection Error</h3>
        <p class="text-surface-400 mb-6">{error}</p>
        <button onclick={loadData} class="btn variant-soft-primary">
          Retry
        </button>
      </div>
    {:else if loading}
      <LoadingSpinner />
    {:else if imageryFinders.length === 0}
      <div class="text-center py-16">
        <div class="text-6xl mb-4 opacity-20">🗺️</div>
        <h3 class="text-xl font-semibold mb-2">No imagery finders yet</h3>
        <p class="text-surface-400 mb-6">
          Create your first finder to start searching for satellite imagery
        </p>
        <button
          onclick={() => goto("/archive/create")}
          class="btn variant-filled-primary"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Finder</span>
        </button>
      </div>
    {:else}
      <div class="space-y-3">
        {#each imageryFinders as finder}
          <a
            href="/archive/finder/{finder.id}"
            class="tile text-left block hover-lift"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="font-semibold text-lg truncate">{finder.name}</h3>
                  {#if finder.is_active}
                    <span class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  {/if}
                </div>
                <div class="flex items-center gap-3 text-sm text-surface-400">
                  <span>{formatDate(finder.start_date)} - {formatDate(finder.end_date)}</span>
                  <span>•</span>
                  <span>{finder.studies?.length || 0} {finder.studies?.length === 1 ? 'study' : 'studies'}</span>
                  {#if finder.location?.name}
                    <span>•</span>
                    <span class="truncate">{finder.location.name}</span>
                  {/if}
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <svg class="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </SectionPanel>
</div>
