<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import MiniMap from "$lib/components/shared/MiniMap.svelte";
  import PaginatedList from "$lib/components/shared/PaginatedList.svelte";
  import { formatDate } from "$lib/utils/dates";
  import { statusInfo } from "$lib/utils/status";
  import { ChevronRight, Plug, Plus, RefreshCcw } from "@lucide/svelte";

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
        if (response.status === 502) {
          error = "Backend service is unavailable. Please check that the Augur API is running.";
        } else {
          error = `Failed to load finders: ${response.statusText}`;
        }
        loading = false;
        return;
      }
      
      const data = await response.json();
      imageryFinders = Array.isArray(data) ? data : [];
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load data";
    } finally {
      loading = false;
    }
  }


  // Calculate study statistics
  const studyStats = $derived.by(() => {
    const stats: Record<string, number> = {};
    let total = 0;
    
    imageryFinders.forEach(finder => {
      finder.studies?.forEach((study: any) => {
        const status = study.status || 'UNKNOWN';
        stats[status] = (stats[status] || 0) + 1;
        total++;
      });
    });
    
    return { stats, total };
  });
</script>

<div class="page-stack">
  <header class="page-head animate-fadeIn">
    <div class="min-w-0">
      <p class="eyebrow">Index · Finders</p>
      <h1>Data finders</h1>
      <p>Saved searches against public imagery catalogues, and the studies run from them.</p>
    </div>
    <button onclick={() => goto("/archive/create")} class="btn btn-primary shrink-0">
      <Plus size={14} strokeWidth={1.5} />
      <span>New finder</span>
    </button>
  </header>

  {#if !loading && !error && imageryFinders.length > 0}
    <div class="flex flex-wrap gap-y-6 animate-fadeIn stagger-1">
      <div class="stat">
        <p class="eyebrow">Finders</p>
        <p class="stat-value">{imageryFinders.length}</p>
      </div>
      <div class="stat">
        <p class="eyebrow">Studies</p>
        <p class="stat-value">{studyStats.total}</p>
      </div>
      {#each Object.entries(studyStats.stats).sort((a, b) => b[1] - a[1]) as [status, count]}
        {@const info = statusInfo(status)}
        <div class="stat">
          <p class="eyebrow">{info.label}</p>
          <p class="stat-value {info.tone}">{count}</p>
        </div>
      {/each}
    </div>
  {/if}

  <section class="panel animate-fadeIn stagger-2">
    {#if error}
      <div class="flex flex-col items-center px-4 py-14 text-center">
        <Plug size={28} strokeWidth={1.25} class="mb-5 text-rust" />
        <h3 class="font-display text-2xl text-moon">Backend unavailable</h3>
        <p class="mx-auto mt-2 mb-6 max-w-md text-sm text-haze">{error}</p>
        <button onclick={loadData} class="btn">
          <RefreshCcw size={14} strokeWidth={1.5} />
          Retry connection
        </button>
      </div>
    {:else if loading}
      <LoadingSpinner message="Loading finders" />
    {:else}
      <div class="p-2 sm:p-3">
        <PaginatedList
          items={imageryFinders}
          itemsPerPage={10}
          emptyTitle="No finders yet"
          emptyMessage="Create your first finder to start searching public data."
        >
          {#snippet emptyAction()}
            <button onclick={() => goto("/archive/create")} class="btn btn-primary">
              <Plus size={14} strokeWidth={1.5} />
              New finder
            </button>
          {/snippet}
          {#snippet children(finder)}
            <a href="/archive/finder/{finder.id}" class="row">
              <div class="flex items-center gap-4">
                {#if finder.location?.geometry || finder.geometry}
                  <div class="hidden sm:block">
                    <MiniMap geometry={finder.location?.geometry || finder.geometry} width="96px" height="64px" />
                  </div>
                {/if}
                <div class="min-w-0 flex-1">
                  <div class="mb-1 flex items-center gap-2.5">
                    <h3 class="truncate font-medium text-moon">{finder.name}</h3>
                    {#if finder.is_active}
                      <span class="chip shrink-0 text-sage">Active</span>
                    {/if}
                  </div>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-haze">
                    <span class="readout">{formatDate(finder.start_date)} → {formatDate(finder.end_date)}</span>
                    <span class="readout">{finder.studies?.length || 0} {finder.studies?.length === 1 ? 'study' : 'studies'}</span>
                    {#if finder.location?.name}
                      <span class="truncate text-dust">{finder.location.name}</span>
                    {/if}
                  </div>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} class="shrink-0 text-shade" />
              </div>
            </a>
          {/snippet}
        </PaginatedList>
      </div>
    {/if}
  </section>
</div>
