<script lang="ts">
  import { onMount } from "svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";

  let providers = $state<any[]>([]);
  let integrations = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
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

  function filterIntegrationsByProvider(providerId: number) {
    return integrations.filter((i) => i.provider === providerId);
  }
</script>

<div class="page-stack">
  <SectionPanel variant="hero">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold mb-2">Data Sources</h1>
        <p class="text-surface-300">
          Available public data sources and their integrations
        </p>
      </div>
    </div>
  </SectionPanel>

  <SectionPanel>
    {#if loading}
      <LoadingSpinner />
    {:else if error}
      <div class="text-center py-12">
        <div class="text-5xl mb-3 opacity-20">⚠️</div>
        <h3 class="text-lg font-semibold mb-2">Connection Error</h3>
        <p class="text-surface-400 mb-6">{error}</p>
        <button onclick={loadData} class="btn variant-soft-primary">
          Retry
        </button>
      </div>
    {:else if providers.length === 0}
      <div class="text-center py-16">
        <div class="text-6xl mb-4 opacity-20">🛰️</div>
        <h3 class="text-xl font-semibold mb-2">No providers configured</h3>
        <p class="text-surface-400">
          No data sources are available
        </p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each providers as provider}
          <div class="stat-card">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-semibold mb-1">{provider.name}</h3>
                <div class="flex items-center gap-2 text-sm text-surface-400">
                  {#if provider.is_active}
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Active</span>
                  {:else}
                    <span class="w-2 h-2 rounded-full bg-surface-500"></span>
                    <span>Inactive</span>
                  {/if}
                  <span>•</span>
                  <span>{filterIntegrationsByProvider(provider.id).length} {filterIntegrationsByProvider(provider.id).length === 1 ? 'integration' : 'integrations'}</span>
                </div>
              </div>
            </div>

            {#if filterIntegrationsByProvider(provider.id).length > 0}
              <div class="mt-3 space-y-2">
                {#each filterIntegrationsByProvider(provider.id) as integration}
                  <div class="flex items-center justify-between text-sm p-2 bg-surface-900/30 rounded">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{integration.name}</span>
                      {#if !integration.is_active}
                        <span class="text-xs text-surface-500">(inactive)</span>
                      {/if}
                    </div>
                    <div class="text-surface-500">
                      {integration.config_options?.length || 0} options
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </SectionPanel>
</div>
