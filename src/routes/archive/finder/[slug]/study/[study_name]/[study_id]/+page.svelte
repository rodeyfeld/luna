<script lang="ts">
  import { page } from '$app/stores';
  import { ArrowLeft, ChevronRight, CircleAlert } from "@lucide/svelte";
  import EmptyState from "$lib/components/shared/EmptyState.svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import StudyMap from "$lib/components/Study/ImageryFinder/Map.svelte";

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

<div class="min-w-0 space-y-6">
  <header class="page-head">
    <div class="min-w-0 flex-1">
      <nav class="flex min-w-0 flex-wrap items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-haze" aria-label="Breadcrumb">
        <a href="/dashboard" class="hover:text-moon">Finders</a>
        <ChevronRight size={12} strokeWidth={1.5} class="text-shade" />
        <a href="/areas-of-interest" class="hover:text-moon">Areas</a>
        {#if finder?.location?.id}
          <ChevronRight size={12} strokeWidth={1.5} class="text-shade" />
          <a href="/areas-of-interest/{finder.location.id}" class="max-w-[12rem] truncate hover:text-moon">
            {finder.location.name || `Location #${finder.location.id}`}
          </a>
        {/if}
        <ChevronRight size={12} strokeWidth={1.5} class="text-shade" />
        <a href="/archive/finder/{$page.params.slug}" class="max-w-[14rem] truncate hover:text-moon">
          {finder?.name || 'Finder'}
        </a>
      </nav>
      <h1>Study results</h1>
      <div class="readout mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-haze">
        <span>study <span class="text-dust">{data.studyName}</span></span>
        <span>id <span class="text-dust">{data.studyId}</span></span>
        {#if studyData?.imagery_finder_id}
          <span>finder <span class="text-dust">{finder?.name || studyData?.imagery_finder_id}</span></span>
        {/if}
        {#if results.length > 0}
          <span><span class="text-moon">{results.length}</span> {results.length === 1 ? 'scene' : 'scenes'}</span>
        {/if}
      </div>
    </div>
    <a href="/archive/finder/{$page.params.slug}" class="btn btn-quiet shrink-0">
      <ArrowLeft size={14} strokeWidth={1.5} />
      <span>Back to finder</span>
    </a>
  </header>

  {#if data.error}
    <div class="panel flex flex-col items-center px-6 py-14 text-center">
      <CircleAlert size={28} strokeWidth={1.25} class="mb-4 text-rust" />
      <h3 class="font-display text-3xl text-moon">Results unavailable</h3>
      <p class="mt-2 max-w-md text-sm text-haze">{data.error}</p>
    </div>
  {:else if !data.studyResults}
    <div class="flex w-full items-center justify-center py-12">
      <LoadingSpinner message="Loading study results" />
    </div>
  {:else if results.length > 0}
    <div class="lg:h-[calc(100vh-16rem)] lg:min-h-[520px]">
      <StudyMap study={data.studyResults} />
    </div>
  {:else}
    <div class="panel">
      <EmptyState
        title="No archive imagery found"
        description="This study didn't find any scenes matching the search criteria."
      >
        {#snippet action()}
          <a href="/archive/finder/{$page.params.slug}" class="btn">Back to finder</a>
        {/snippet}
      </EmptyState>
    </div>
  {/if}
</div>
