<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
  import MiniMap from "$lib/components/shared/MiniMap.svelte";
  import PaginatedList from "$lib/components/shared/PaginatedList.svelte";
  import { formatDate } from "$lib/utils/dates";

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

  // Format status labels
  function formatStatus(status: string): string {
    return status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Get status color
  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'RUNNING': 'text-blue-400',
      'COMPLETED': 'text-green-400',
      'SUCCESS': 'text-green-400',
      'ANOMALOUS': 'text-yellow-400',
      'FAILED': 'text-red-400',
      'ERROR': 'text-red-400',
      'INITIALIZED': 'text-surface-400',
      'PENDING': 'text-surface-400',
    };
    return colors[status] || 'text-surface-300';
  }
</script>

<div class="page-stack">
  <SectionPanel variant="hero">
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-4">Data Finders</h1>
        
        {#if !loading && imageryFinders.length > 0}
          <div class="flex flex-wrap gap-3">
            <div class="stat-card bg-surface-800/50">
              <p class="text-xs uppercase tracking-wider text-surface-400">Total Studies</p>
              <p class="text-2xl font-bold text-primary-400">{studyStats.total}</p>
            </div>
            {#each Object.entries(studyStats.stats).sort((a, b) => b[1] - a[1]) as [status, count]}
              <div class="stat-card bg-surface-800/30">
                <p class="text-xs uppercase tracking-wider text-surface-400">{formatStatus(status)}</p>
                <p class="text-2xl font-bold {getStatusColor(status)}">{count}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      <button
        onclick={() => goto("/archive/create")}
        class="btn variant-filled-primary shrink-0"
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
        <div class="text-5xl mb-3 opacity-20">🔌</div>
        <h3 class="text-lg font-semibold mb-2">Backend Unavailable</h3>
        <p class="text-surface-400 mb-6">{error}</p>
        <button onclick={loadData} class="btn variant-soft-primary">
          Retry Connection
        </button>
      </div>
    {:else if loading}
      <LoadingSpinner />
    {:else}
      <PaginatedList
        items={imageryFinders}
        itemsPerPage={10}
        emptyMessage="No finders yet. Create your first finder to start searching public data."
        emptyIcon="🗺️"
      >
        {#snippet children(finder)}
          <a
            href="/archive/finder/{finder.id}"
            class="tile text-left block hover-lift"
          >
            <div class="flex items-center gap-4">
              {#if finder.location?.geometry || finder.geometry}
                <MiniMap geometry={finder.location?.geometry || finder.geometry} width="100px" height="70px" />
              {/if}
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
        {/snippet}
      </PaginatedList>
    {/if}
  </SectionPanel>
</div>
