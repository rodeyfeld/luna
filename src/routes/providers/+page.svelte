<script lang="ts">
  import { onMount } from "svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import EmptyState from "$lib/components/shared/EmptyState.svelte";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
  import { formatDate, formatDateTime, formatRelativeTime } from "$lib/utils/dates";
  import { CircleAlert, RefreshCcw } from "@lucide/svelte";

  const DAY_MS = 86400000;

  let providers = $state<any[]>([]);
  let integrations = $state<any[]>([]);
  let freshness = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    loadFreshness();
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;

    try {
      const [providersResponse, integrationsResponse] = await Promise.all([
        fetch('/api/providers'),
        fetch('/api/providers/integrations'),
      ]);

      if (!providersResponse.ok) {
        error = `Failed to load providers: ${providersResponse.statusText}`;
      } else {
        const providersData = await providersResponse.json();
        providers = Array.isArray(providersData) ? providersData : [];
      }

      if (integrationsResponse.ok) {
        const integrationsData = await integrationsResponse.json();
        integrations = Array.isArray(integrationsData) ? integrationsData : [];
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
    }

    loading = false;
  }

  // Extra detail loaded on its own so a slow or failing archive query never holds up the page
  async function loadFreshness() {
    try {
      const response = await fetch('/api/providers/archive/freshness');
      if (response.ok) {
        const data = await response.json();
        freshness = Array.isArray(data) ? data : [];
      }
    } catch {
      freshness = [];
    }
  }

  function filterIntegrationsByProvider(providerId: number) {
    return integrations.filter((i) => i.provider === providerId);
  }

  function freshnessForProvider(providerId: number) {
    return freshness.find((f) => f.id === providerId);
  }

  function ageInDays(dateStr: string | null) {
    return dateStr ? (Date.now() - new Date(dateStr).getTime()) / DAY_MS : Infinity;
  }

  // Recent captures read as relative time; stale ones get the full date
  function formatAcquired(dateStr: string | null) {
    return ageInDays(dateStr) < 7 ? formatRelativeTime(dateStr) : formatDate(dateStr);
  }

  // Fresh within the nightly sync's lookback, aging within a month, stale beyond
  function freshnessTone(dateStr: string | null) {
    const days = ageInDays(dateStr);
    if (days <= 3) return 'bg-sage';
    if (days <= 30) return 'bg-sodium';
    return 'bg-shade';
  }
</script>

<div class="page-stack">
  <header class="page-head animate-fadeIn">
    <div class="min-w-0">
      <p class="eyebrow">Register · Sources</p>
      <h1>Data sources</h1>
      <p>
        Public imagery providers Luna can search, and the integrations wired up for each. New Copernicus
        Sentinel captures sync into the catalog nightly at 02:00 UTC.
      </p>
    </div>
    {#if !loading && !error}
      <p class="readout shrink-0 text-xs text-haze">
        {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
        <span class="text-shade">·</span>
        {integrations.length} {integrations.length === 1 ? 'integration' : 'integrations'}
      </p>
    {/if}
  </header>

  {#if loading}
    <LoadingSpinner message="Loading sources" />
  {:else if error}
    <section class="panel flex flex-col items-center px-4 py-14 text-center">
      <CircleAlert size={28} strokeWidth={1.25} class="mb-5 text-rust" />
      <h3 class="font-display text-2xl text-moon">Connection error</h3>
      <p class="mx-auto mt-2 mb-6 max-w-md text-sm text-haze">{error}</p>
      <button onclick={loadData} class="btn">
        <RefreshCcw size={14} strokeWidth={1.5} />
        Retry
      </button>
    </section>
  {:else if providers.length === 0}
    <section class="panel">
      <EmptyState title="No providers configured" description="No data sources are available yet." />
    </section>
  {:else}
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {#each providers as provider, i}
        {@const providerIntegrations = filterIntegrationsByProvider(provider.id)}
        {@const catalog = freshnessForProvider(provider.id)}
        <section class="panel animate-fadeIn stagger-{Math.min(i + 1, 5)} flex flex-col">
          <div class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div class="min-w-0">
              <p class="eyebrow readout">No. {String(provider.id).padStart(2, '0')}</p>
              <h3 class="mt-1.5 truncate font-display text-2xl text-moon">{provider.name}</h3>
            </div>
            <div class="shrink-0 pt-1">
              <StatusBadge status={provider.is_active ? 'ACTIVE' : 'INACTIVE'} size="sm" />
            </div>
          </div>

          {#if providerIntegrations.length > 0}
            <ul>
              {#each providerIntegrations as integration}
                <li class="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5 text-sm last:border-b-0">
                  <span class="flex min-w-0 items-center gap-2">
                    <span class="truncate {integration.is_active ? 'text-dust' : 'text-shade'}">{integration.name}</span>
                    {#if !integration.is_active}
                      <span class="chip shrink-0 text-haze">Inactive</span>
                    {/if}
                  </span>
                  <span class="readout shrink-0 text-xs text-haze">
                    {integration.config_options?.length || 0} options
                  </span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="px-5 py-4 text-sm text-shade">No integrations</p>
          {/if}

          {#if catalog?.collections?.length}
            <div class="mt-auto border-t border-line">
              <div class="flex items-baseline justify-between gap-3 px-5 pt-4 pb-2">
                <p class="eyebrow">Catalog</p>
                <p class="readout text-xs text-haze" title={formatDateTime(catalog.last_ingested)}>
                  last ingest {formatRelativeTime(catalog.last_ingested)}
                </p>
              </div>
              <ul class="pb-3">
                {#each catalog.collections as collection}
                  <li class="flex items-center justify-between gap-3 px-5 py-1 text-xs">
                    <span class="flex min-w-0 items-center gap-2">
                      <span class="size-1.5 shrink-0 rounded-full {freshnessTone(collection.latest_acquired)}"></span>
                      <span class="readout truncate text-dust">{collection.name}</span>
                    </span>
                    <span class="readout shrink-0 text-haze" title={formatDateTime(collection.latest_acquired)}>
                      {formatAcquired(collection.latest_acquired)}
                    </span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </section>
      {/each}
    </div>
  {/if}
</div>
