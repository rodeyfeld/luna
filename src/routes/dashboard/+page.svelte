<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getImageryFinders } from "$lib/api/augur";
  import LoadingSpinner from "$lib/components/shared/LoadingSpinner.svelte";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";
  import StatCard from "$lib/components/shared/StatCard.svelte";

  let imageryFinders = $state<any[]>([]);
  let recentStudies = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;

    try {
      // Fetch imagery finders
      const findersResponse = await getImageryFinders();
      if (findersResponse.error) {
        error = findersResponse.error;
      } else if (findersResponse.data) {
        const finders = findersResponse.data as any[];
        imageryFinders = finders;

        // Extract all studies from finders
        const allStudies: any[] = [];
        finders.forEach((finder: any) => {
          if (finder.studies && finder.studies.length > 0) {
            finder.studies.forEach((study: any) => {
              allStudies.push({
                ...study,
                imagery_finder_id: finder.id,
                imagery_finder_name: finder.name,
              });
            });
          }
        });

        // Sort by created date (most recent first)
        recentStudies = allStudies.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );
      }

      // Optionally also fetch dream details for more comprehensive status
      // const dreamsResponse = await getDreamDetails();
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load data";
    } finally {
      loading = false;
    }
  }

  function getStatusVariant(status: string) {
    const statusMap: Record<string, string> = {
      COMPLETED: "variant-filled-success",
      RUNNING: "variant-filled-warning",
      PENDING: "variant-soft-surface",
      FAILED: "variant-filled-error",
      ANOMALOUS: "variant-filled-error",
    };
    return statusMap[status] || "variant-soft-surface";
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
    <SectionPanel variant="hero" className="space-y-8">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
          <p class="uppercase tracking-[0.3em] text-xs text-surface-300/70 mb-2">
            Operations Overview
          </p>
        <h1 class="text-4xl font-bold">Dashboard</h1>
          <p class="text-surface-200/80 mt-2">
            Manage imagery finders, study runs, and provider activity.
        </p>
      </div>
        <div class="flex flex-wrap gap-3">
      <button
        onclick={() => goto("/archive/create")}
        class="btn variant-filled-primary"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>New Imagery Finder</span>
      </button>
        </div>
      </div>

      <div class="stat-grid">
        <StatCard
          label="Active Finders"
          value={imageryFinders.filter((f) => f.is_active).length}
          hint="Currently ingesting"
          icon="🗺️"
          accent
        />
        <StatCard
          label="Running Studies"
          value={recentStudies.filter((s) => s.status === "RUNNING").length}
          hint="Processing imagery now"
          icon="⚡"
        />
        <StatCard
          label="Completed"
          value={recentStudies.filter((s) => s.status === "COMPLETED").length}
          hint="Last 30 days"
          icon="✓"
        />
        <StatCard
          label="Total Searches"
          value={imageryFinders.length}
          hint="All time"
          icon="📊"
        />
      </div>
    </SectionPanel>

    <!-- Recent Studies -->
    <SectionPanel>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Recent Studies</h2>
        <button class="btn btn-sm variant-ghost-surface">View All</button>
      </div>

      {#if loading}
        <LoadingSpinner />
      {:else if recentStudies.length === 0}
        <div class="text-center py-12">
          <div class="text-6xl mb-4 opacity-30">🔍</div>
          <p class="text-lg text-surface-600-300-token mb-4">No studies yet</p>
          <button
            onclick={() => goto("/archive/create")}
            class="btn variant-soft-primary"
          >
            Create your first imagery finder
          </button>
        </div>
      {:else}
        <div class="tile-list">
          {#each recentStudies.slice(0, 5) as study}
            <button
              onclick={() => goto(`/archive/finder/${study.imagery_finder_id}`)}
              class="tile text-left w-full"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="badge {getStatusVariant(study.status)}">
                      {study.status}
                    </span>
                    <span class="font-semibold">{study.study_name}</span>
                  </div>
                  <p class="text-sm text-surface-400">
                    {study.imagery_finder_name ||
                      `Finder #${study.imagery_finder_id}`}
                  </p>
                </div>
                <div class="text-right text-sm text-surface-400">
                  <p>{formatDate(study.created)}</p>
                </div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </SectionPanel>

    <!-- Imagery Finders -->
    <SectionPanel>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Imagery Finders</h2>
        <div class="flex gap-2">
          <button class="btn btn-sm variant-ghost-surface">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
          <button class="btn btn-sm variant-ghost-surface">View All</button>
        </div>
      </div>

      {#if error}
        <aside class="alert variant-filled-warning mb-4">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div class="alert-message">
            <h3 class="font-bold">Unable to connect to Augur API</h3>
            <p>{error}. Make sure Augur backend is running.</p>
          </div>
        </aside>
      {/if}

      {#if loading}
        <LoadingSpinner />
      {:else if error}
        <div class="text-center py-12">
          <div class="text-6xl mb-4 opacity-30">🔌</div>
          <p class="text-lg text-surface-400 mb-4">
            API Connection Unavailable
          </p>
          <p class="text-sm text-surface-500 mb-6 max-w-md mx-auto">
            Unable to load imagery finders. Please check that the Augur backend
            is running.
          </p>
          <button onclick={loadData} class="btn variant-soft-primary">
            Retry Connection
          </button>
        </div>
      {:else if imageryFinders.length === 0}
        <div class="text-center py-12">
          <div class="text-6xl mb-4 opacity-30">🗺️</div>
          <p class="text-lg text-surface-400 mb-4">
            No imagery finders yet
          </p>
          <p class="text-sm text-surface-500 mb-6 max-w-md mx-auto">
            Imagery finders let you define areas of interest and search for
            satellite imagery within specific time periods.
          </p>
          <button
            onclick={() => goto("/archive/create")}
            class="btn variant-filled-primary"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Imagery Finder</span>
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {#each imageryFinders.slice(0, 6) as finder}
            <button
              onclick={() => goto(`/archive/finder/${finder.id}`)}
              class="tile text-left"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-1">{finder.name}</h3>
                  <p class="text-sm text-surface-400">
                    {formatDate(finder.start_date)} - {formatDate(
                      finder.end_date
                    )}
                  </p>
                </div>
                <span
                  class="badge {finder.is_active
                    ? 'variant-filled-success'
                    : 'variant-soft-surface'}"
                >
                  {finder.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div class="flex items-center gap-2 text-sm text-surface-400">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>{finder.studies?.length || 0} studies</span>
                <span class="mx-2">•</span>
                <span>{finder.geometry.type}</span>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </SectionPanel>

    <!-- Quick Actions -->
    <SectionPanel variant="muted">
      <h2 class="text-2xl font-bold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onclick={() => goto("/archive/create")}
          class="btn variant-soft-primary justify-start"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Imagery Finder</span>
        </button>
        <button
          onclick={() => goto("/providers")}
          class="btn variant-soft-secondary justify-start"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span>View Providers</span>
        </button>
        <button
          onclick={() => goto("/imagery")}
          class="btn variant-soft-tertiary justify-start"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Browse Imagery</span>
        </button>
      </div>
    </SectionPanel>
</div>
