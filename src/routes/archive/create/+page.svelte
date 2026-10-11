<script lang="ts">
    import { onMount } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
    import MiniMap from '$lib/components/shared/MiniMap.svelte';
    import { ChevronDown, CircleAlert, LoaderCircle, Pencil, RefreshCcw, Play } from '@lucide/svelte';
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
                    study_name: 'imagery-finder-study',
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
    <header class="page-head">
        <div class="min-w-0">
            <p class="eyebrow">Finder · new</p>
            <h1>New imagery finder</h1>
            <p>
                Confirm the area you just drew, set the archive window and filters, and hand the package straight to
                the archive_lookup study.
            </p>
        </div>
        <div class="flex flex-wrap gap-2">
            <button class="btn" onclick={() => goto('/areas-of-interest')}>
                <Pencil size={13} strokeWidth={1.5} />
                <span>Edit areas</span>
            </button>
            <button class="btn btn-quiet" onclick={loadSavedGeometries} disabled={savedLoading}>
                <RefreshCcw size={13} strokeWidth={1.5} class={savedLoading ? 'animate-spin' : ''} />
                <span>{savedLoading ? 'Syncing' : 'Sync library'}</span>
            </button>
        </div>
    </header>

    {#if error}
        <div class="flex items-start gap-3 rounded-md border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust" role="alert">
            <CircleAlert size={16} strokeWidth={1.5} class="mt-0.5 shrink-0" />
            <p>{error}</p>
        </div>
    {/if}

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <!-- Configuration -->
        <div class="min-w-0 space-y-6">
            <section class="panel p-5 sm:p-6">
                <p class="eyebrow">01 · Sources</p>
                <h2 class="mt-2 font-display text-2xl text-moon">Data sources</h2>
                <p class="mt-1 mb-5 text-sm text-haze">
                    Every selected source is queried at once for the widest coverage.
                </p>
                {#if providers.length > 0}
                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {#each providers as provider}
                            {@const checked = selectedProviders.has(provider.id || provider.name)}
                            <label
                                class="flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition-colors {checked
                                    ? 'border-line-strong bg-ink-2'
                                    : 'border-line hover:border-line-strong'}"
                            >
                                <input
                                    type="checkbox"
                                    class="mt-1 h-3.5 w-3.5 shrink-0"
                                    {checked}
                                    onchange={() => toggleProvider(provider.id || provider.name)}
                                />
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm text-moon">{provider.name}</p>
                                    {#if provider.description}
                                        <p class="mt-0.5 text-xs text-haze">{provider.description}</p>
                                    {/if}
                                </div>
                            </label>
                        {/each}
                    </div>
                {:else}
                    <LoadingSpinner size="sm" message="Loading providers" />
                {/if}
            </section>

            <section class="panel space-y-5 p-5 sm:p-6">
                <div>
                    <p class="eyebrow">02 · Window</p>
                    <h2 class="mt-2 font-display text-2xl text-moon">Name and time window</h2>
                </div>

                <label class="field">
                    <span>Finder name <span class="text-sodium">*</span></span>
                    <input
                        class="input"
                        type="text"
                        placeholder="e.g. Midtown canopy audit · Spring 2024"
                        bind:value={name}
                    />
                </label>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label class="field">
                        <span>Archive start <span class="text-sodium">*</span></span>
                        <input class="input" type="date" bind:value={startDate} />
                    </label>

                    <label class="field">
                        <span>Archive end <span class="text-sodium">*</span></span>
                        <input class="input" type="date" bind:value={endDate} />
                    </label>
                </div>
            </section>

            <section class="panel">
                <button
                    class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    onclick={() => (showAdvanced = !showAdvanced)}
                    aria-expanded={showAdvanced}
                >
                    <div>
                        <p class="eyebrow">03 · Filters</p>
                        <h2 class="mt-2 font-display text-2xl text-moon">
                            Refine results <span class="font-sans text-sm text-haze">optional</span>
                        </h2>
                    </div>
                    <ChevronDown
                        size={16}
                        strokeWidth={1.5}
                        class="shrink-0 text-haze transition-transform {showAdvanced ? 'rotate-180' : ''}"
                    />
                </button>

                {#if showAdvanced}
                    <div class="grid grid-cols-1 gap-4 border-t border-line px-5 py-5 sm:grid-cols-2 sm:px-6">
                        <label class="field sm:col-span-2">
                            <span>Max cloud coverage (%)</span>
                            <input
                                class="input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="e.g. 20"
                                bind:value={cloudCoverage}
                            />
                        </label>
                        <label class="field">
                            <span>EO resolution max (cm)</span>
                            <input class="input" type="number" placeholder="e.g. 50" bind:value={eoResolutionMax} />
                        </label>
                        <label class="field">
                            <span>EO resolution min (cm)</span>
                            <input class="input" type="number" placeholder="e.g. 10" bind:value={eoResolutionMin} />
                        </label>
                        <label class="field">
                            <span>SAR resolution max (cm)</span>
                            <input class="input" type="number" placeholder="e.g. 100" bind:value={sarResolutionMax} />
                        </label>
                        <label class="field">
                            <span>SAR resolution min (cm)</span>
                            <input class="input" type="number" placeholder="e.g. 25" bind:value={sarResolutionMin} />
                        </label>
                    </div>
                {/if}
            </section>
        </div>

        <!-- Review & launch -->
        <aside class="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <section class="panel">
                <div class="border-b border-line px-5 py-4">
                    <p class="eyebrow">Review</p>
                    <h2 class="mt-2 font-display text-2xl text-moon">Launch plan</h2>
                </div>

                <div class="border-b border-line p-5">
                    {#if geometry}
                        {#key selectedGeometryId}
                            <MiniMap {geometry} width="100%" height="140px" />
                        {/key}
                    {:else}
                        <div class="flex h-[140px] items-center justify-center rounded border border-dashed border-line-strong text-xs text-haze">
                            No area selected
                        </div>
                    {/if}
                </div>

                <dl class="divide-y divide-line text-sm">
                    <div class="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt class="eyebrow shrink-0">Area</dt>
                        <dd class="min-w-0 text-right">
                            <p class="truncate text-moon">
                                {selectedGeometryRecord ? selectedGeometryRecord.name : 'None selected'}
                            </p>
                            <p class="readout text-[0.7rem] text-haze">{geometrySummary}</p>
                        </dd>
                    </div>
                    <div class="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt class="eyebrow shrink-0">Name</dt>
                        <dd class="min-w-0 truncate text-right {name ? 'text-moon' : 'text-shade'}">{name || 'Pending'}</dd>
                    </div>
                    <div class="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt class="eyebrow shrink-0">Window</dt>
                        <dd class="readout text-right text-xs text-moon">{dateRangeSummary}</dd>
                    </div>
                    <div class="flex items-baseline justify-between gap-4 px-5 py-3">
                        <dt class="eyebrow shrink-0">Plan</dt>
                        <dd class="text-right text-moon">{autoExecute ? 'Create + run' : 'Create only'}</dd>
                    </div>
                    {#if hasAdvancedFilters}
                        <div class="px-5 py-3">
                            <dt class="eyebrow mb-2">Filters</dt>
                            <dd class="space-y-1">
                                {#each activeFilters as filter}
                                    <p class="flex justify-between gap-4 text-xs">
                                        <span class="text-haze">{filter.label}</span>
                                        <span class="readout text-moon">{filter.value}</span>
                                    </p>
                                {/each}
                            </dd>
                        </div>
                    {/if}
                </dl>

                <div class="space-y-4 border-t border-line p-5">
                    <label class="flex cursor-pointer items-start gap-3">
                        <input class="mt-1 h-3.5 w-3.5 shrink-0" type="checkbox" bind:checked={autoExecute} />
                        <span>
                            <span class="block text-sm text-moon">Run archive_lookup after creation</span>
                            <span class="block text-xs text-haze">
                                Turn off to review the finder page before executing.
                            </span>
                        </span>
                    </label>

                    <p class="text-xs {isLaunchReady ? 'text-dust' : 'text-sodium'}">{launchStatusMessage}</p>

                    <button
                        class="btn btn-primary w-full"
                        onclick={handleCreate}
                        disabled={!isLaunchReady || creating || executing}
                    >
                        {#if creating || executing}
                            <LoaderCircle size={14} strokeWidth={1.5} class="animate-spin" />
                            <span>{creating ? 'Creating' : 'Executing'}</span>
                        {:else}
                            <Play size={14} strokeWidth={1.5} />
                            <span>Launch finder</span>
                        {/if}
                    </button>
                </div>
            </section>
        </aside>
    </div>

    {#if creating || executing}
        <LoadingSpinner message={creating ? 'Creating imagery finder' : 'Executing archive lookup'} />
    {/if}
</div>
