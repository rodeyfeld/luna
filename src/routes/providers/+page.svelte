<script lang="ts">
  import { onMount } from "svelte";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import EmptyState from "$lib/components/shared/EmptyState.svelte";
  import StatusBadge from "$lib/components/shared/StatusBadge.svelte";

  let providers = $state<any[]>([]);
  let integrations = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedProvider = $state<any>(null);

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
        providers = providersData.results || [];
      }

      if (integrationsResponse.ok) {
        const integrationsData = await integrationsResponse.json();
        integrations = integrationsData.results || [];
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
    }

    loading = false;
  }

  function filterIntegrationsByProvider(providerId: number) {
    return integrations.filter((i) => i.provider === providerId);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<div class="w-full h-full overflow-y-auto">
  <div class="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold mb-2">Satellite Providers</h1>
      <p class="text-surface-600-300-token text-lg">
        Browse available satellite imagery providers and their integrations
      </p>
    </div>

    {#if loading}
      <LoadingSpinner message="Loading providers..." />
    {:else if error}
      <div class="card p-6">
        <EmptyState
          icon="🔌"
          title="Unable to Connect to API"
          description={`${error}. Make sure the Augur backend is running.`}
        >
          {#snippet action()}
            <button onclick={loadData} class="btn variant-soft-primary">
              Retry Connection
            </button>
          {/snippet}
        </EmptyState>
      </div>
    {:else if providers.length === 0}
      <div class="card p-6">
        <EmptyState
          icon="🛰️"
          title="No Providers Available"
          description="No satellite providers are currently configured"
        />
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Providers List -->
        <div class="lg:col-span-1 space-y-3">
          {#each providers as provider}
            <button
              onclick={() => (selectedProvider = provider)}
              class="w-full card p-5 text-left hover-lift transition-smooth {selectedProvider?.id ===
              provider.id
                ? 'ring-2 ring-primary-500'
                : ''}"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-lg">{provider.name}</h3>
                <StatusBadge
                  status={provider.is_active ? "ACTIVE" : "INACTIVE"}
                  size="sm"
                />
              </div>
              <p class="text-sm text-surface-600-300-token">
                Added {formatDate(provider.created)}
              </p>
              <div
                class="mt-3 flex items-center gap-2 text-sm text-surface-600-300-token"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span
                  >{filterIntegrationsByProvider(provider.id).length} integrations</span
                >
              </div>
            </button>
          {/each}
        </div>

        <!-- Provider Details -->
        <div class="lg:col-span-2">
          {#if selectedProvider}
            <div class="card p-6 space-y-6">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-2xl font-bold">{selectedProvider.name}</h2>
                  <StatusBadge
                    status={selectedProvider.is_active ? "ACTIVE" : "INACTIVE"}
                  />
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="p-3 bg-surface-100-800-token rounded-lg">
                    <p class="text-surface-600-300-token mb-1">Created</p>
                    <p class="font-medium">
                      {formatDate(selectedProvider.created)}
                    </p>
                  </div>
                  <div class="p-3 bg-surface-100-800-token rounded-lg">
                    <p class="text-surface-600-300-token mb-1">Last Modified</p>
                    <p class="font-medium">
                      {formatDate(selectedProvider.modified)}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Integrations -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Integrations</h3>

                {#each filterIntegrationsByProvider(selectedProvider.id) as integration}
                  <div class="card p-5 mb-3">
                    <div class="flex items-start justify-between mb-3">
                      <h4 class="font-semibold text-lg">{integration.name}</h4>
                      <StatusBadge
                        status={integration.is_active ? "ACTIVE" : "INACTIVE"}
                        size="sm"
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p class="text-surface-600-300-token mb-1">
                          Configuration Options
                        </p>
                        <p class="font-medium">
                          {integration.config_options?.length || 0} options
                        </p>
                      </div>
                      <div>
                        <p class="text-surface-600-300-token mb-1">
                          Capabilities
                        </p>
                        <p class="font-medium">
                          {integration.capability_options?.length || 0} capabilities
                        </p>
                      </div>
                    </div>

                    <div class="mt-3 text-sm text-surface-600-300-token">
                      <p>Created: {formatDate(integration.created)}</p>
                    </div>
                  </div>
                {:else}
                  <EmptyState
                    icon="🔌"
                    title="No Integrations"
                    description="This provider has no configured integrations yet"
                  />
                {/each}
              </div>
            </div>
          {:else}
            <div class="card p-6">
              <EmptyState
                icon="👈"
                title="Select a Provider"
                description="Choose a provider from the list to view details and integrations"
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-6 variant-glass-primary">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600-300-token">Total Providers</p>
              <p class="text-3xl font-bold mt-1">{providers.length}</p>
            </div>
            <div class="text-4xl opacity-50">🛰️</div>
          </div>
        </div>

        <div class="card p-6 variant-glass-secondary">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600-300-token">Active Providers</p>
              <p class="text-3xl font-bold mt-1">
                {providers.filter((p) => p.is_active).length}
              </p>
            </div>
            <div class="text-4xl opacity-50">✓</div>
          </div>
        </div>

        <div class="card p-6 variant-glass-tertiary">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600-300-token">
                Total Integrations
              </p>
              <p class="text-3xl font-bold mt-1">{integrations.length}</p>
            </div>
            <div class="text-4xl opacity-50">🔌</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
