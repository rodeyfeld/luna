<script lang="ts">
  import { page } from '$app/stores';
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
  import { formatDate, formatDateTime } from "$lib/utils/dates";

  interface Props {
    data: {
      finderData: any;
      studyResults: any;
      studyName: string;
      studyId: string;
      error: string | null;
    };
  }

  let { data }: Props = $props();

  const finder = $derived(data.finderData);
  const results = $derived(data.studyResults?.study_data?.results || []);
  const studyData = $derived(data.studyResults?.study_data);

</script>

<div class="w-full h-full overflow-y-auto p-6 space-y-4">
  
  <!-- Breadcrumbs -->
  <nav class="flex items-center gap-2 text-sm mb-2">
    <a href="/dashboard" class="text-surface-400 hover:text-surface-200 transition-smooth">
      Dashboard
    </a>
    <svg class="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    <a href="/areas-of-interest" class="text-surface-400 hover:text-surface-200 transition-smooth">
      Areas of Interest
    </a>
    {#if finder?.location?.id}
      <svg class="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <a href="/areas-of-interest/{finder.location.id}" class="text-surface-400 hover:text-surface-200 transition-smooth">
        {finder.location.name || `Location #${finder.location.id}`}
      </a>
    {/if}
    <svg class="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    <a href="/archive/finder/{$page.params.slug}" class="text-surface-400 hover:text-surface-200 transition-smooth">
      {finder?.name || 'Finder'}
    </a>
    <svg class="w-4 h-4 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    <span class="text-surface-200 font-medium">Study Results</span>
  </nav>

  <!-- Study Header -->
  <SectionPanel>
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-xl font-bold mb-2">Study Results</h1>
        <div class="flex items-center gap-3 text-sm text-surface-400">
          <span>Study: {data.studyName}</span>
          <span>•</span>
          <span>ID: {data.studyId}</span>
          {#if studyData?.imagery_finder_id}
            <span>•</span>
            <span>Finder: {finder?.name || data.studyData.imagery_finder_id}</span>
          {/if}
        </div>
      </div>
      <a href="/archive/finder/{$page.params.slug}" class="btn btn-sm variant-ghost-surface">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Finder</span>
      </a>
    </div>
  </SectionPanel>

  {#if data.error}
    <SectionPanel>
      <div class="text-center py-12">
        <div class="text-5xl mb-3 opacity-20">⚠️</div>
        <h3 class="text-lg font-semibold mb-2">Error Loading Results</h3>
        <p class="text-surface-400">{data.error}</p>
      </div>
    </SectionPanel>
  {:else if !data.studyResults}
    <div class="w-full h-full flex items-center justify-center py-12">
      <LoadingSpinner message="Loading study results..." />
    </div>
  {:else}
    <!-- Archive Imagery Results -->
    <SectionPanel>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Archive Imagery Found</h2>
        <span class="text-xs text-surface-500">
          {results.length} {results.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {#if results.length > 0}
        <div class="overflow-x-auto">
          <table class="table table-compact table-hover w-full">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Sensor</th>
                <th>Technique</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Geometry Type</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {#each results as result}
                <tr class="hover:bg-surface-800/50 transition-smooth">
                  <td class="font-medium">{result.collection || '—'}</td>
                  <td class="text-sm">{result.sensor?.name || '—'}</td>
                  <td class="text-sm">{result.sensor?.technique || '—'}</td>
                  <td class="text-sm text-surface-400">{formatDate(result.start_date)}</td>
                  <td class="text-sm text-surface-400">{formatDate(result.end_date)}</td>
                  <td class="text-sm">{result.geometry?.type || '—'}</td>
                  <td class="text-sm">{result.provider || '—'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="text-center py-16">
          <div class="text-5xl mb-3 opacity-20">🔍</div>
          <h3 class="text-lg font-semibold mb-2">No Archive Imagery Found</h3>
          <p class="text-surface-400 mb-6">
            This study didn't find any satellite imagery matching the search criteria.
          </p>
          <a href="/archive/finder/{$page.params.slug}" class="btn variant-soft-primary">
            Back to Finder
          </a>
        </div>
      {/if}
    </SectionPanel>
  {/if}
</div>

