<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { createArchiveFinder, executeStudy } from '$lib/api/augur';
    import type { CreateArchiveFinderRequest } from '$lib/api/augur';
    import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Draw from 'ol/interaction/Draw';
    import { fromLonLat } from 'ol/proj';
    import GeoJSON from 'ol/format/GeoJSON';
    import 'ol/ol.css';

    let mapElement: HTMLDivElement;
    let map: Map;
    let vectorSource: VectorSource;
    let drawInteraction: Draw;

    // Form state
    let step = $state<1 | 2 | 3>(1);
    let name = $state('');
    let startDate = $state('');
    let endDate = $state('');
    let geometry = $state<any>(null);
    let geometryType = $state<'Point' | 'Polygon'>('Polygon');
    
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

    onMount(() => {
        initMap();
        
        // Set default dates (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = today.toISOString().split('T')[0];
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        return () => {
            map?.dispose();
        };
    });

    function initMap() {
        vectorSource = new VectorSource();
        
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        map = new Map({
            target: mapElement,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: fromLonLat([0, 20]),
                zoom: 2,
            }),
        });

        enableDrawing();
    }

    function enableDrawing() {
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
        }

        drawInteraction = new Draw({
            source: vectorSource,
            type: geometryType,
        });

        drawInteraction.on('drawend', (event) => {
            const feature = event.feature;
            const geom = feature.getGeometry();
            if (geom) {
                const geoJSON = new GeoJSON();
                const geoJSONGeom = geoJSON.writeGeometryObject(geom, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                });
                geometry = geoJSONGeom;
            }
            
            // Clear previous features
            setTimeout(() => {
                const features = vectorSource.getFeatures();
                if (features.length > 1) {
                    vectorSource.removeFeature(features[0]);
                }
            }, 100);
        });

        map.addInteraction(drawInteraction);
    }

    function clearDrawing() {
        vectorSource.clear();
        geometry = null;
    }

    function changeGeometryType(type: 'Point' | 'Polygon') {
        geometryType = type;
        clearDrawing();
        enableDrawing();
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

        const request: CreateArchiveFinderRequest = {
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

        const response = await createArchiveFinder(request);

        if (response.error) {
            error = `Unable to create archive finder: ${response.error}. Please ensure the Augur backend is running.`;
            creating = false;
            return;
        }

        creating = false;

        if (autoExecute && response.data) {
            await handleExecuteStudy(response.data.archive_finder_id);
        } else if (response.data) {
            goto(`/archive/finder/${response.data.archive_finder_id}`);
        }
    }

    async function handleExecuteStudy(finderId: number) {
        executing = true;
        error = null;

        const response = await executeStudy(finderId, 'imagery_finder');

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
                error = 'Please draw an area on the map';
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

    const isStepValid = $derived(() => {
        if (step === 1) return geometry !== null;
        if (step === 2) return name && startDate && endDate && new Date(startDate) < new Date(endDate);
        return true;
    });
</script>

<style>
    .map-container {
        height: 500px;
        width: 100%;
        border-radius: 0.5rem;
        overflow: hidden;
    }
</style>

<div class="w-full h-full overflow-y-auto">
    <div class="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
            <button 
                onclick={() => goto('/dashboard')}
                class="btn btn-sm variant-ghost-surface"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <h1 class="text-3xl font-bold">Create Archive Finder</h1>
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
                        <span class="font-medium">Draw Area</span>
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

        <!-- Step 1: Draw Area -->
        {#if step === 1}
            <div class="card p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold">Step 1: Define Area of Interest</h2>
                    <div class="flex gap-2">
                        <button 
                            onclick={() => changeGeometryType('Polygon')}
                            class="btn btn-sm {geometryType === 'Polygon' ? 'variant-filled-primary' : 'variant-soft-surface'}"
                        >
                            Polygon
                        </button>
                        <button 
                            onclick={() => changeGeometryType('Point')}
                            class="btn btn-sm {geometryType === 'Point' ? 'variant-filled-primary' : 'variant-soft-surface'}"
                        >
                            Point
                        </button>
                        <button 
                            onclick={clearDrawing}
                            class="btn btn-sm variant-ghost-error"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <p class="text-surface-600-300-token">
                    Click on the map to draw your area of interest. For polygons, click multiple points and double-click to finish.
                </p>

                <div class="map-container" bind:this={mapElement}></div>

                {#if geometry}
                    <div class="alert variant-filled-success">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <div class="alert-message">
                            <p>Area defined successfully! ({geometry.type})</p>
                        </div>
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
                            <p>{geometry?.type || 'Not defined'}</p>
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
                        <span>Create Archive Finder</span>
                    {/if}
                </button>
            {/if}
        </div>

        {#if creating || executing}
            <LoadingSpinner message={creating ? 'Creating archive finder...' : 'Executing study...'} />
        {/if}
    </div>
</div>
