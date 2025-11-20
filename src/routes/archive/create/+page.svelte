<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import { createImageryFinder, executeStudy, getImagery } from '$lib/api/augur';
    import type { CreateImageryFinderRequest } from '$lib/api/augur';
    import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
import { normalizeGeometry, type GeoJSONGeometry } from '$lib/utils/geometry';

    // Form state
    let step = $state<1 | 2 | 3>(1);
    let name = $state('');
    let startDate = $state('');
    let endDate = $state('');
    let savedGeometries = $state<any[]>([]);
    let savedLoading = $state(true);
    let selectedGeometryId = $state<string>('');
    
    // Advanced filters
    let showAdvanced = $state(false);
    let cloudCoverage = $state<number | null>(null);
    let eoResolutionMax = $state<number | null>(null);
    let eoResolutionMin = $state<number | null>(null);
    let sarResolutionMax = $state<number | null>(null);
    let sarResolutionMin = $state<number | null>(null);

    // Execution state
    let creating = $state(false);
    let executing = $state(false);
    let error = $state<string | null>(null);
let autoExecute = $state(true);

    onMount(async () => {
        // Set default dates (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = today.toISOString().split('T')[0];
        startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const geometryParam = get(page).url.searchParams.get('geometryId');
        if (geometryParam) {
            selectedGeometryId = geometryParam;
        }
        await loadSavedGeometries();

        return () => {};
    });

    async function loadSavedGeometries() {
        savedLoading = true;
        const response = await getImagery();
        if (!response.error) {
            savedGeometries = (response.data as any[]) ?? [];
            if (selectedGeometryId && !savedGeometries.find((item) => String(item.id) === String(selectedGeometryId))) {
                selectedGeometryId = '';
            }
        }
        savedLoading = false;
    }

    function selectGeometry(id: string | number) {
        selectedGeometryId = String(id);
        step = 1;
        error = null;
    }

    async function handleCreate() {
        if (!geometry) {
            error = 'Please draw an area on the map';
            return;
        }

        if (!name || !startDate || !endDate) {
            error = 'Please fill in all required fields';
            return;
        }

        creating = true;
        error = null;

        const request: CreateImageryFinderRequest = {
            name,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            geometry: JSON.stringify(geometry),
            rules: {
                cloud_coverage_pct: cloudCoverage,
                eo_resolution_max_cm: eoResolutionMax,
                eo_resolution_min_cm: eoResolutionMin,
                sar_resolution_max_cm: sarResolutionMax,
                sar_resolution_min_cm: sarResolutionMin,
            },
        };

        const response = await createImageryFinder(request);

        if (response.error) {
            error = `Unable to create imagery finder: ${response.error}. Please ensure the Augur backend is running.`;
            creating = false;
            return;
        }

        creating = false;

        if (autoExecute && response.data) {
            await handleExecuteStudy(response.data.imagery_finder_id);
        } else if (response.data) {
            goto(`/archive/finder/${response.data.imagery_finder_id}`);
        }
    }

    async function handleExecuteStudy(finderId: number) {
        executing = true;
        error = null;

        const response = await executeStudy(finderId, 'archive_lookup');

        executing = false;

        if (response.error) {
            error = response.error;
            // Still navigate to the finder page
            goto(`/archive/finder/${finderId}`);
            return;
        }

        goto(`/archive/finder/${finderId}`);
    }

    function nextStep() {
        if (step === 1) {
            if (!geometry) {
                error = 'Please select a geometry from the library';
                return;
            }
            error = null;
        }
        if (step < 3) step++;
    }

    function prevStep() {
        if (step > 1) step--;
        error = null;
    }

    const selectedGeometryRecord = $derived(() => {
        if (!selectedGeometryId) return null;
        return savedGeometries.find((item) => String(item.id) === String(selectedGeometryId)) ?? null;
    });

    const geometry = $derived<GeoJSONGeometry | null>(() => {
        if (!selectedGeometryRecord) return null;
        const parsed = typeof selectedGeometryRecord.geometry === 'string'
            ? JSON.parse(selectedGeometryRecord.geometry)
            : selectedGeometryRecord.geometry;
        return normalizeGeometry(parsed);
    });

    const geometrySummary = $derived(() => geometry?.type ?? 'Not defined');
    const lastUpdated = $derived(() => {
        const latest = savedGeometries[0]?.modified ?? savedGeometries[0]?.updated;
        return latest ? new Date(latest).toLocaleDateString() : '—';
    });

    const isStepValid = $derived(() => {
        if (step === 1) return geometry !== null;
        if (step === 2) return name && startDate && endDate && new Date(startDate) < new Date(endDate);
        return true;
    });

    function startImageryFinder() {
        if (!geometry) {
            error = 'Select a geometry from the library before launching a study.';
            step = 1;
            return;
        }
        error = null;
        step = 2;
    }
</script>

<div class="w-full h-full overflow-y-auto">
    <div class="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
            <button 
                onclick={() => goto('/dashboard')}
                class="btn btn-sm variant-ghost-surface"
                aria-label="Back to dashboard"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <h1 class="text-3xl font-bold">Create Imagery Finder</h1>
                <p class="text-surface-600-300-token">Define an area and search for satellite imagery</p>
            </div>
        </div>

        <!-- Progress Steps -->
        <div class="card p-6">
            <ol class="flex items-center w-full">
                <li class="flex items-center {step >= 1 ? 'text-primary-500' : 'text-surface-400-600-token'} space-x-2.5">
                    <span class="flex items-center justify-center w-8 h-8 border-2 rounded-full shrink-0 {step >= 1 ? 'border-primary-500 bg-primary-500 text-white' : 'border-surface-400-600-token'}">
                        {step > 1 ? '✓' : '1'}
                    </span>
                    <span class="hidden sm:inline-block">
                        <span class="font-medium">Select Geometry</span>
                    </span>
                </li>
                <div class="flex-1 h-0.5 mx-4 {step >= 2 ? 'bg-primary-500' : 'bg-surface-300-700-token'}"></div>
                <li class="flex items-center {step >= 2 ? 'text-primary-500' : 'text-surface-400-600-token'} space-x-2.5">
                    <span class="flex items-center justify-center w-8 h-8 border-2 rounded-full shrink-0 {step >= 2 ? 'border-primary-500 bg-primary-500 text-white' : 'border-surface-400-600-token'}">
                        {step > 2 ? '✓' : '2'}
                    </span>
                    <span class="hidden sm:inline-block">
                        <span class="font-medium">Configure</span>
                    </span>
                </li>
                <div class="flex-1 h-0.5 mx-4 {step >= 3 ? 'bg-primary-500' : 'bg-surface-300-700-token'}"></div>
                <li class="flex items-center {step >= 3 ? 'text-primary-500' : 'text-surface-400-600-token'} space-x-2.5">
                    <span class="flex items-center justify-center w-8 h-8 border-2 rounded-full shrink-0 {step >= 3 ? 'border-primary-500 bg-primary-500 text-white' : 'border-surface-400-600-token'}">
                        3
                    </span>
                    <span class="hidden sm:inline-block">
                        <span class="font-medium">Review</span>
                    </span>
                </li>
            </ol>
        </div>

        {#if error}
            <aside class="alert variant-filled-error">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="alert-message">
                    <h3 class="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            </aside>
        {/if}

        <div class="card p-6 space-y-4">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 class="text-xl font-semibold">Available Studies</h3>
                    <p class="text-sm text-surface-500">
                        Choose a study to run with the selected geometry. More capabilities are on the way.
                    </p>
                </div>
                {#if selectedGeometryRecord}
                    <span class="badge variant-soft-primary text-xs">
                        Geometry: {selectedGeometryRecord.name}
                    </span>
                {:else}
                    <span class="text-xs text-surface-500">
                        Select a geometry to enable Imagery Finder.
                    </span>
                {/if}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="tile space-y-3">
                    <div>
                        <p class="text-sm text-surface-400 uppercase tracking-[0.3em]">Available</p>
                        <h4 class="text-lg font-semibold">Imagery Finder</h4>
                        <p class="text-sm text-surface-500">
                            Configure search parameters and run imagery ingestion on the selected geometry.
                        </p>
                    </div>
                    <button
                        class="btn variant-filled-primary w-full"
                        onclick={startImageryFinder}
                        disabled={!geometry}
                    >
                        {geometry ? 'Configure Imagery Finder' : 'Select a Geometry First'}
                    </button>
                </div>
                <div class="tile space-y-3 opacity-70">
                    <div>
                        <p class="text-sm text-surface-400 uppercase tracking-[0.3em]">Coming Soon</p>
                        <h4 class="text-lg font-semibold">Wind Study</h4>
                        <p class="text-sm text-surface-500">
                            Analyze wind characteristics for the chosen area of interest.
                        </p>
                    </div>
                    <button class="btn variant-soft-surface w-full" disabled>
                        Wind Study (Coming Soon)
                    </button>
                </div>
            </div>
        </div>

        <!-- Step 1: Draw Area -->
        {#if step === 1}
            <div class="card p-6 space-y-6">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 class="text-2xl font-bold">Step 1: Select a Geometry</h2>
                        <p class="text-sm text-surface-500">
                            Use a geometry from the Imagery Requests library. Need a new AOI? Create it there first, then return to launch a study.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="btn btn-sm variant-ghost-surface"
                            onclick={loadSavedGeometries}
                            disabled={savedLoading}
                        >
                            {savedLoading ? 'Refreshing...' : 'Refresh List'}
                        </button>
                        <button
                            class="btn btn-sm variant-filled-primary"
                            onclick={() => goto('/imagery')}
                        >
                            Create Geometry
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="stat-card" data-variant="accent">
                        <p class="text-sm text-surface-300/80">Saved Geometries</p>
                        <p class="text-3xl font-bold">{savedGeometries.length}</p>
                        <span class="text-xs text-surface-300/70">Available for studies</span>
                    </div>
                    <div class="stat-card">
                        <p class="text-sm text-surface-300/80">Last Updated</p>
                        <p class="text-lg font-semibold">{lastUpdated}</p>
                        <span class="text-xs text-surface-300/70">Newest entry</span>
                    </div>
                </div>

                {#if savedLoading}
                    <LoadingSpinner message="Fetching saved geometries..." />
                {:else if savedGeometries.length === 0}
                    <div class="text-center py-12">
                        <div class="text-5xl mb-4 opacity-30">🗺️</div>
                        <p class="text-lg text-surface-400 mb-2">No saved geometries yet</p>
                        <p class="text-sm text-surface-500 mb-4">
                            Open the Imagery Requests page to define your first reusable area.
                        </p>
                        <button class="btn variant-filled-primary" onclick={() => goto('/imagery')}>
                            Create Geometry
                        </button>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each savedGeometries as saved}
                            <div class="tile flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p class="font-semibold">{saved.name}</p>
                                    <p class="text-sm text-surface-500">
                                        Saved {saved.created ? new Date(saved.created).toLocaleDateString() : '—'}
                                    </p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        class={`btn btn-sm ${selectedGeometryId === String(saved.id) ? 'variant-filled-primary' : 'variant-soft-surface'}`}
                                        onclick={() => selectGeometry(saved.id)}
                                    >
                                        {selectedGeometryId === String(saved.id) ? 'Selected' : 'Select'}
                                    </button>
                                    <button
                                        class="btn btn-sm variant-ghost-surface"
                                        onclick={() => goto('/imagery')}
                                    >
                                        Open in Imagery
                                    </button>
                                </div>
                            </div>
                        {/each}

                        {#if selectedGeometryRecord}
                            <div class="tile space-y-2">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-semibold">{selectedGeometryRecord.name}</p>
                                        <p class="text-xs text-surface-500">
                                            Geometry ID: {selectedGeometryRecord.id}
                                        </p>
                                    </div>
                                    <span class="badge variant-soft">
                                        {geometrySummary}
                                    </span>
                                </div>
                                <p class="text-sm text-surface-400">
                                    This geometry will feed into every study configured below.
                                </p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Step 2: Configure Search -->
        {#if step === 2}
            <div class="card p-6 space-y-6">
                <h2 class="text-2xl font-bold">Step 2: Configure Search Parameters</h2>

                <label class="label">
                    <span>Search Name <span class="text-error-500">*</span></span>
                    <input 
                        class="input" 
                        type="text" 
                        placeholder="e.g., Downtown Forest Coverage Q1 2024"
                        bind:value={name}
                    />
                </label>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="label">
                        <span>Start Date <span class="text-error-500">*</span></span>
                        <input 
                            class="input" 
                            type="date" 
                            bind:value={startDate}
                        />
                    </label>

                    <label class="label">
                        <span>End Date <span class="text-error-500">*</span></span>
                        <input 
                            class="input" 
                            type="date" 
                            bind:value={endDate}
                        />
                    </label>
                </div>

                <!-- Advanced Filters -->
                <div>
                    <button 
                        onclick={() => showAdvanced = !showAdvanced}
                        class="btn variant-ghost-surface w-full justify-between"
                    >
                        <span>Advanced Filters (Optional)</span>
                        <svg class="w-5 h-5 transition-transform {showAdvanced ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {#if showAdvanced}
                        <div class="mt-4 p-4 space-y-4 bg-surface-100-800-token rounded-lg">
                            <label class="label">
                                <span>Maximum Cloud Coverage (%)</span>
                                <input 
                                    class="input" 
                                    type="number" 
                                    min="0" 
                                    max="100"
                                    placeholder="e.g., 20"
                                    bind:value={cloudCoverage}
                                />
                            </label>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label class="label">
                                    <span>EO Resolution Max (cm)</span>
                                    <input 
                                        class="input" 
                                        type="number" 
                                        placeholder="e.g., 50"
                                        bind:value={eoResolutionMax}
                                    />
                                </label>

                                <label class="label">
                                    <span>EO Resolution Min (cm)</span>
                                    <input 
                                        class="input" 
                                        type="number" 
                                        placeholder="e.g., 10"
                                        bind:value={eoResolutionMin}
                                    />
                                </label>

                                <label class="label">
                                    <span>SAR Resolution Max (cm)</span>
                                    <input 
                                        class="input" 
                                        type="number" 
                                        placeholder="e.g., 100"
                                        bind:value={sarResolutionMax}
                                    />
                                </label>

                                <label class="label">
                                    <span>SAR Resolution Min (cm)</span>
                                    <input 
                                        class="input" 
                                        type="number" 
                                        placeholder="e.g., 25"
                                        bind:value={sarResolutionMin}
                                    />
                                </label>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Step 3: Review and Create -->
        {#if step === 3}
            <div class="card p-6 space-y-6">
                <h2 class="text-2xl font-bold">Step 3: Review and Create</h2>

                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-surface-100-800-token rounded-lg">
                            <h3 class="font-semibold mb-2">Search Name</h3>
                            <p>{name}</p>
                        </div>

                        <div class="p-4 bg-surface-100-800-token rounded-lg">
                            <h3 class="font-semibold mb-2">Geometry Type</h3>
                            <p>{geometrySummary}</p>
                        </div>

                        <div class="p-4 bg-surface-100-800-token rounded-lg">
                            <h3 class="font-semibold mb-2">Start Date</h3>
                            <p>{new Date(startDate).toLocaleDateString()}</p>
                        </div>

                        <div class="p-4 bg-surface-100-800-token rounded-lg">
                            <h3 class="font-semibold mb-2">End Date</h3>
                            <p>{new Date(endDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {#if cloudCoverage || eoResolutionMax || eoResolutionMin || sarResolutionMax || sarResolutionMin}
                        <div class="p-4 bg-surface-100-800-token rounded-lg">
                            <h3 class="font-semibold mb-3">Advanced Filters</h3>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                {#if cloudCoverage}<p>Cloud Coverage: ≤{cloudCoverage}%</p>{/if}
                                {#if eoResolutionMax}<p>EO Resolution Max: {eoResolutionMax}cm</p>{/if}
                                {#if eoResolutionMin}<p>EO Resolution Min: {eoResolutionMin}cm</p>{/if}
                                {#if sarResolutionMax}<p>SAR Resolution Max: {sarResolutionMax}cm</p>{/if}
                                {#if sarResolutionMin}<p>SAR Resolution Min: {sarResolutionMin}cm</p>{/if}
                            </div>
                        </div>
                    {/if}

                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input 
                            class="checkbox" 
                            type="checkbox" 
                            bind:checked={autoExecute}
                        />
                        <span>Automatically execute imagery finder study after creation</span>
                    </label>
                </div>
            </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="flex justify-between">
            <button 
                onclick={prevStep}
                disabled={step === 1}
                class="btn variant-ghost-surface"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
            </button>

            {#if step < 3}
                <button 
                    onclick={nextStep}
                    disabled={!isStepValid()}
                    class="btn variant-filled-primary"
                >
                    <span>Next</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            {:else}
                <button 
                    onclick={handleCreate}
                    disabled={creating || executing}
                    class="btn variant-filled-primary"
                >
                    {#if creating || executing}
                        <span>Creating...</span>
                    {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Create Imagery Finder</span>
                    {/if}
                </button>
            {/if}
        </div>

        {#if creating || executing}
            <LoadingSpinner message={creating ? 'Creating imagery finder...' : 'Executing study...'} />
        {/if}
    </div>
</div>
