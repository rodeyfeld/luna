<script lang="ts">
    import { onMount } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import SectionPanel from '$lib/components/shared/SectionPanel.svelte';
    import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
    import { normalizeGeometry, type GeoJSONGeometry } from '$lib/utils/geometry';

    let name = $state('');
    let startDate = $state('');
    let endDate = $state('');
    let savedGeometries = $state<any[]>([]);
    let savedLoading = $state(true);
    let selectedGeometryId = $state<string>('');
    let providers = $state<any[]>([]);
    let selectedProviders = $state<Set<string>>(new Set());

    let showAdvanced = $state(false);
    let cloudCoverage = $state<number | null>(null);
    let eoResolutionMax = $state<number | null>(null);
    let eoResolutionMin = $state<number | null>(null);
    let sarResolutionMax = $state<number | null>(null);
    let sarResolutionMin = $state<number | null>(null);

    let creating = $state(false);
    let executing = $state(false);
    let error = $state<string | null>(null);
    let autoExecute = $state(true);

    onMount(async () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = today.toISOString().split('T')[0];
        startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const geometryParam = get(page).url.searchParams.get('geometryId');
        if (geometryParam) {
            selectedGeometryId = geometryParam;
        }

        // Check if we're duplicating/referencing an existing finder
        const fromParam = get(page).url.searchParams.get('from');
        if (fromParam) {
            await loadExistingFinder(fromParam);
        }

        await Promise.all([loadSavedGeometries(), loadProviders()]);

        return () => {};
    });

    async function loadExistingFinder(finderId: string) {
        try {
            const response = await fetch(`/api/archive/finder_data/${finderId}`);
            if (!response.ok) return;
            
            const data = await response.json();
            const finder = data;
            
            if (finder) {
                // Pre-populate form with existing finder's data
                name = `${finder.name} (Copy)`;
                
                // Convert ISO date strings to input date format (YYYY-MM-DD)
                if (finder.start_date) {
                    startDate = new Date(finder.start_date).toISOString().split('T')[0];
                }
                if (finder.end_date) {
                    endDate = new Date(finder.end_date).toISOString().split('T')[0];
                }
                
                // Load advanced rules if they exist
                if (finder.rules) {
                    try {
                        const rules = JSON.parse(finder.rules);
                        if (rules.cloud_coverage !== undefined) {
                            cloudCoverage = rules.cloud_coverage;
                            showAdvanced = true;
                        }
                        if (rules.eo_resolution_max !== undefined) {
                            eoResolutionMax = rules.eo_resolution_max;
                            showAdvanced = true;
                        }
                        if (rules.eo_resolution_min !== undefined) {
                            eoResolutionMin = rules.eo_resolution_min;
                            showAdvanced = true;
                        }
                        if (rules.sar_resolution_max !== undefined) {
                            sarResolutionMax = rules.sar_resolution_max;
                            showAdvanced = true;
                        }
                        if (rules.sar_resolution_min !== undefined) {
                            sarResolutionMin = rules.sar_resolution_min;
                            showAdvanced = true;
                        }
                    } catch (e) {
                        console.error('Failed to parse finder rules:', e);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load existing finder:', e);
        }
    }

    async function loadSavedGeometries() {
        savedLoading = true;
        try {
            const response = await fetch('/api/imagery');
            
            if (response.ok) {
                const data = await response.json();
                savedGeometries = Array.isArray(data) ? data : [];
                if (selectedGeometryId && !savedGeometries.find((item) => String(item.id) === String(selectedGeometryId))) {
                    selectedGeometryId = '';
                }
                // Set default name based on selected geometry
                if (selectedGeometryId) {
                    const selected = savedGeometries.find((item) => String(item.id) === String(selectedGeometryId));
                    if (selected && !name) {
                        name = `${selected.name} - ${new Date().toLocaleString()}`;
                    }
                }
            }
        } catch (err) {
            console.error('Failed to load geometries:', err);
        }
        savedLoading = false;
    }

    async function loadProviders() {
        try {
            const response = await fetch('/api/providers');
            if (response.ok) {
                const data = await response.json();
                providers = Array.isArray(data) ? data : [];
                // Select all providers by default
                selectedProviders = new Set(providers.map((p) => p.id || p.name));
            }
        } catch (err) {
            console.error('Failed to load providers:', err);
        }
    }

    function toggleProvider(providerId: string) {
        const newSet = new Set(selectedProviders);
        if (newSet.has(providerId)) {
            newSet.delete(providerId);
        } else {
            newSet.add(providerId);
        }
        selectedProviders = newSet;
    }

    function selectGeometry(id: string | number) {
        selectedGeometryId = String(id);
        error = null;
        // Set default name based on selected geometry
        const selected = savedGeometries.find((item) => String(item.id) === String(id));
        if (selected && !name) {
            name = `${selected.name} - ${new Date().toLocaleString()}`;
        }
    }

    async function handleCreate() {
        if (!geometry) {
            error = 'Select a geometry from the library before launching an imagery finder.';
            return;
        }

        if (!name.trim() || !startDate || !endDate) {
            error = 'Provide a name plus start and end dates.';
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            error = 'End date must be later than the start date.';
            return;
        }

        creating = true;
        error = null;

        const request = {
            name: name.trim(),
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            geometry: JSON.stringify(geometry),
            location_id: selectedGeometryId ? parseInt(selectedGeometryId) : undefined,
            rules: {
                cloud_coverage_pct: cloudCoverage,
                eo_resolution_max_cm: eoResolutionMax,
                eo_resolution_min_cm: eoResolutionMin,
                sar_resolution_max_cm: sarResolutionMax,
                sar_resolution_min_cm: sarResolutionMin
            }
        };

        try {
            const response = await fetch('/api/archive/finder_create', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            creating = false;

            if (!response.ok) {
                error = `Unable to create imagery finder: ${response.statusText}. Please ensure the Augur backend is running.`;
                return;
            }

            const data = await response.json();
            const finderId = data?.imagery_finder_id;

            if (autoExecute && finderId) {
                await handleExecuteStudy(finderId);
            } else if (finderId) {
                await invalidateAll();
                goto(`/archive/finder/${finderId}`);
            }
        } catch (err) {
            creating = false;
            error = err instanceof Error ? err.message : 'Failed to create finder';
        }
    }

    async function handleExecuteStudy(finderId: number) {
        executing = true;
        error = null;

        try {
            const response = await fetch('/api/archive/finder_execute', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    imagery_finder_id: finderId,
                    study_name: 'archive_lookup',
                }),
            });

            executing = false;

            if (!response.ok) {
                error = `Failed to execute study: ${response.statusText}`;
            }

            await invalidateAll();
            goto(`/archive/finder/${finderId}`);
        } catch (err) {
            executing = false;
            error = err instanceof Error ? err.message : 'Failed to execute study';
            await invalidateAll();
            goto(`/archive/finder/${finderId}`);
        }
    }

    function hasFilterValue(value: number | null): value is number {
        return value !== null && value !== undefined;
    }

    const selectedGeometryRecord = $derived(
        selectedGeometryId
            ? savedGeometries.find((item) => String(item.id) === String(selectedGeometryId)) ?? null
            : null
    );

    const geometry = $derived.by<GeoJSONGeometry | null>(() => {
        if (!selectedGeometryRecord) return null;
        try {
            const parsed =
                typeof selectedGeometryRecord.geometry === 'string'
                    ? JSON.parse(selectedGeometryRecord.geometry)
                    : selectedGeometryRecord.geometry;
            return normalizeGeometry(parsed);
        } catch (e) {
            console.error('Failed to parse geometry:', e);
            return null;
        }
    });

    const geometrySummary = $derived(geometry?.type ?? 'Not defined');
    
    const lastUpdated = $derived.by(() => {
        const latest = savedGeometries[0]?.modified ?? savedGeometries[0]?.updated;
        return latest ? new Date(latest).toLocaleDateString() : '—';
    });

    const dateRangeSummary = $derived.by(() => {
        if (!startDate || !endDate) return 'Dates pending';
        return `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
    });

    const activeFilters = $derived.by(() => {
        const filters: { label: string; value: string }[] = [];
        if (hasFilterValue(cloudCoverage)) {
            filters.push({ label: 'Cloud coverage', value: `<= ${cloudCoverage}%` });
        }
        if (hasFilterValue(eoResolutionMax)) {
            filters.push({ label: 'EO resolution max', value: `${eoResolutionMax} cm` });
        }
        if (hasFilterValue(eoResolutionMin)) {
            filters.push({ label: 'EO resolution min', value: `${eoResolutionMin} cm` });
        }
        if (hasFilterValue(sarResolutionMax)) {
            filters.push({ label: 'SAR resolution max', value: `${sarResolutionMax} cm` });
        }
        if (hasFilterValue(sarResolutionMin)) {
            filters.push({ label: 'SAR resolution min', value: `${sarResolutionMin} cm` });
        }
        return filters;
    });

    const hasAdvancedFilters = $derived(activeFilters.length > 0);

    const isLaunchReady = $derived.by(() => {
        if (!geometry) return false;
        if (!name.trim() || !startDate || !endDate) return false;
        return new Date(startDate) < new Date(endDate);
    });

    const launchStatusMessage = $derived.by(() => {
        if (!geometry) return 'Select a saved geometry to unlock the imagery finder.';
        if (!name.trim()) return 'Provide a name so you can recognize the finder later.';
        if (!startDate || !endDate) return 'Choose start and end dates for the archive lookup.';
        if (new Date(startDate) >= new Date(endDate)) return 'End date must be after the start date.';
        return autoExecute
            ? 'Finder will run the archive_lookup study immediately after creation.'
            : 'Finder will be created and can be executed later from its detail page.';
    });
</script>

<div class="page-stack">
    <SectionPanel variant="hero">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-4 flex-1">
                <p class="uppercase tracking-[0.3em] text-xs text-surface-300/70">Workflow handoff</p>
                <h1 class="text-4xl font-bold">Imagery Finder Launchpad</h1>
                <p class="text-surface-200/80 max-w-2xl">
                    This screen is the second half of the new workflow: confirm the AOI you just built, shape the archive window,
                    dial in filters, and hand the package directly to the archive_lookup study.
                </p>
                <div class="flex flex-wrap gap-3">
                    <button class="btn variant-filled-primary" onclick={() => goto('/areas-of-interest')}>
                        Edit Geometries
                    </button>
                    <button class="btn variant-ghost-surface" onclick={loadSavedGeometries} disabled={savedLoading}>
                        {savedLoading ? 'Syncing...' : 'Sync Library'}
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 w-full lg:max-w-lg">
                <div class="stat-card" data-variant="accent">
                    <p class="text-sm text-surface-300/80">Active AOI</p>
                    <p class="text-lg font-semibold truncate">
                        {selectedGeometryRecord ? selectedGeometryRecord.name : 'None selected'}
                    </p>
                    <span class="text-xs text-surface-300/70">{geometrySummary}</span>
                </div>
                <div class="stat-card">
                    <p class="text-sm text-surface-300/80">Archive window</p>
                    <p class="text-lg font-semibold">{dateRangeSummary}</p>
                    <span class="text-xs text-surface-300/70">Search window</span>
                </div>
                <div class="stat-card">
                    <p class="text-sm text-surface-300/80">Execution plan</p>
                    <p class="text-lg font-semibold">{autoExecute ? 'Create + run' : 'Create only'}</p>
                    <span class="text-xs text-surface-300/70">archive_lookup study</span>
                </div>
            </div>
        </div>
    </SectionPanel>

    {#if error}
        <SectionPanel variant="muted">
            <aside class="alert variant-filled-error">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="alert-message">
                    <p>{error}</p>
                </div>
            </aside>
        </SectionPanel>
    {/if}

    <SectionPanel className="space-y-6">
        <div>
            <p class="uppercase tracking-[0.3em] text-xs text-surface-400">Configuration</p>
            <h2 class="text-2xl font-bold">Archive Search Settings</h2>
            <p class="text-sm text-surface-500">
                Configure your public data search. Select sources, set time windows, and apply filters to find data matching your requirements.
            </p>
        </div>

        <div class="space-y-4">
            <div>
                <h3 class="text-lg font-semibold mb-2">Data Sources</h3>
                <p class="text-sm text-surface-500 mb-3">
                    Select which public data sources to search. Multiple sources will be queried simultaneously for comprehensive coverage.
                </p>
                {#if providers.length > 0}
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {#each providers as provider}
                            <label class="tile flex items-center gap-3 cursor-pointer hover-lift">
                                <input
                                    type="checkbox"
                                    class="checkbox"
                                    checked={selectedProviders.has(provider.id || provider.name)}
                                    onchange={() => toggleProvider(provider.id || provider.name)}
                                />
                                <div class="flex-1">
                                    <p class="font-semibold">{provider.name}</p>
                                    {#if provider.description}
                                        <p class="text-xs text-surface-500">{provider.description}</p>
                                    {/if}
                                </div>
                            </label>
                        {/each}
                    </div>
                {:else}
                    <div class="tile text-sm text-surface-500">
                        <LoadingSpinner message="Loading providers..." />
                    </div>
                {/if}
            </div>
        </div>

        <label class="label">
            <span>Finder name <span class="text-error-500">*</span></span>
            <input
                class="input"
                type="text"
                placeholder="e.g., Midtown canopy audit · Spring 2024"
                bind:value={name}
            />
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="label">
                <span>Archive start <span class="text-error-500">*</span></span>
                <input class="input" type="date" bind:value={startDate} />
            </label>

            <label class="label">
                <span>Archive end <span class="text-error-500">*</span></span>
                <input class="input" type="date" bind:value={endDate} />
            </label>
        </div>

        <div class="space-y-4">
            <button class="btn variant-ghost-surface w-full justify-between" onclick={() => (showAdvanced = !showAdvanced)}>
                <span>Refine results (optional)</span>
                <svg
                    class={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {#if showAdvanced}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-100-800-token rounded-xl p-4">
                    <label class="label">
                        <span>Maximum cloud coverage (%)</span>
                        <input
                            class="input"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g., 20"
                            bind:value={cloudCoverage}
                        />
                    </label>
                    <label class="label">
                        <span>EO resolution max (cm)</span>
                        <input class="input" type="number" placeholder="e.g., 50" bind:value={eoResolutionMax} />
                    </label>
                    <label class="label">
                        <span>EO resolution min (cm)</span>
                        <input class="input" type="number" placeholder="e.g., 10" bind:value={eoResolutionMin} />
                    </label>
                    <label class="label">
                        <span>SAR resolution max (cm)</span>
                        <input class="input" type="number" placeholder="e.g., 100" bind:value={sarResolutionMax} />
                    </label>
                    <label class="label">
                        <span>SAR resolution min (cm)</span>
                        <input class="input" type="number" placeholder="e.g., 25" bind:value={sarResolutionMin} />
                    </label>
                </div>
            {/if}
        </div>
    </SectionPanel>

    <SectionPanel variant="muted" className="space-y-6">
        <div>
            <p class="uppercase tracking-[0.3em] text-xs text-surface-400">Review & Launch</p>
            <h2 class="text-2xl font-bold">Confirm Configuration</h2>
            <p class="text-sm text-surface-500">
                Review your search settings and launch the public data finder.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="tile space-y-2">
                <p class="text-xs text-surface-400 uppercase tracking-[0.3em]">Finder name</p>
                <p class="text-lg font-semibold">{name || 'Pending name'}</p>
                <p class="text-sm text-surface-500">
                    {selectedGeometryRecord ? selectedGeometryRecord.name : 'Awaiting geometry selection'}
                </p>
            </div>
            <div class="tile space-y-2">
                <p class="text-xs text-surface-400 uppercase tracking-[0.3em]">Archive window</p>
                <p class="text-lg font-semibold">{dateRangeSummary}</p>
                <p class="text-sm text-surface-500">UTC</p>
            </div>
            <div class="tile space-y-2">
                <p class="text-xs text-surface-400 uppercase tracking-[0.3em]">Geometry type</p>
                <p class="text-lg font-semibold">{geometrySummary}</p>
                <p class="text-sm text-surface-500">Normalized GeoJSON</p>
            </div>
        </div>

        {#if hasAdvancedFilters}
            <div class="tile space-y-2">
                <p class="text-xs text-surface-400 uppercase tracking-[0.3em]">Filter stack</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-surface-300">
                    {#each activeFilters as filter}
                        <p><span class="text-surface-500">{filter.label}:</span> {filter.value}</p>
                    {/each}
                </div>
            </div>
        {/if}

        <label class="flex items-center gap-3 cursor-pointer">
            <input class="checkbox" type="checkbox" bind:checked={autoExecute} />
            <div>
                <p class="font-semibold">Auto-run archive_lookup after creation</p>
                <p class="text-xs text-surface-500">
                    Leave this on for zero-touch launches, or disable it if you prefer to review the finder page before execution.
                </p>
            </div>
        </label>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-surface-500">{launchStatusMessage}</p>
            <button
                class="btn variant-filled-primary min-w-[220px]"
                onclick={handleCreate}
                disabled={!isLaunchReady || creating || executing}
            >
                {creating || executing ? 'Working...' : 'Launch Finder'}
            </button>
        </div>
    </SectionPanel>

    {#if creating || executing}
        <LoadingSpinner message={creating ? 'Creating imagery finder...' : 'Executing archive lookup...'} />
    {/if}
</div>

