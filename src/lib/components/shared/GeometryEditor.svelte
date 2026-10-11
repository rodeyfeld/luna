<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from 'svelte';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import VectorLayer from 'ol/layer/Vector';
	import { Vector as VectorSource } from 'ol/source';
	import { drawStyle, highlightStyle } from '$lib/components/Map/MapUtils';
	import { lunaBasemap } from '$lib/components/Map/basemap';
	import { Draw, Modify, Snap } from 'ol/interaction';
	import GeoJSON from 'ol/format/GeoJSON';
	import { Feature } from 'ol';
	import { Point, Polygon, type Geometry } from 'ol/geom';

	type GeoJSONGeometry = ReturnType<GeoJSON['writeGeometryObject']>;

	export let geometry: GeoJSONGeometry | null = null;
	export let drawMode: 'polygon' | 'point' = 'polygon';
	export let height = '420px';
	export let showToolbar = true;
	export let convertPointSize = 0.5; // degrees
	export let onchange: ((event: CustomEvent<{ geometry: GeoJSONGeometry | null }>) => void) | undefined =
		undefined;

	const dispatch = createEventDispatcher<{ change: { geometry: GeoJSONGeometry | null } }>();

	let mapEl: HTMLDivElement;
	let map: Map | null = null;
	let vectorSource: VectorSource;
	let drawInteraction: Draw | null = null;
	let modifyInteraction: Modify | null = null;
	let snapInteraction: Snap | null = null;
	let manualUpdate = false;

	const geoJSONFormatter = new GeoJSON();

	onMount(() => {
		vectorSource = new VectorSource();

		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: highlightStyle
		});

		map = new Map({
			target: mapEl,
			layers: [
				lunaBasemap(),
				vectorLayer
			],
			view: new View({
				center: [0, 20],
				zoom: 2
			})
		});

		modifyInteraction = new Modify({ source: vectorSource });
		modifyInteraction.on('modifyend', (event) => {
			const modified = event.features.item(0);
			if (!modified) return;
			const geom = modified.getGeometry();
			if (!geom) return;
			updateGeometryFromFeature(geom);
		});

		snapInteraction = new Snap({ source: vectorSource });

		map.addInteraction(modifyInteraction);
		map.addInteraction(snapInteraction);
		setDrawInteraction(drawMode);

		// Render initial geometry if provided
		renderGeometry(geometry);
	});

	onDestroy(() => {
		if (!map) return;
		if (drawInteraction) map.removeInteraction(drawInteraction);
		if (modifyInteraction) map.removeInteraction(modifyInteraction);
		if (snapInteraction) map.removeInteraction(snapInteraction);
		map.setTarget(undefined);
	});

	// React to external geometry changes
	$: if (map && geometry && !manualUpdate) {
		renderGeometry(geometry);
	} else if (map && !geometry && !manualUpdate) {
		vectorSource?.clear();
	}

	// React to draw mode changes
	$: if (map) {
		setDrawInteraction(drawMode);
	}

	function setDrawInteraction(mode: 'polygon' | 'point') {
		if (!map || !vectorSource) return;
		if (drawInteraction) {
			map.removeInteraction(drawInteraction);
		}

		if (mode === 'point') {
			drawInteraction = new Draw({
				source: vectorSource,
				type: 'Point',
				style: drawStyle
			});
			drawInteraction.on('drawend', (event) => {
				const point = event.feature.getGeometry() as Point | undefined;
				if (!point) return;
				const [x, y] = point.getCoordinates();
				const size = convertPointSize;
				const polygon = new Polygon([
					[
						[x - size, y - size],
						[x + size, y - size],
						[x + size, y + size],
						[x - size, y + size],
						[x - size, y - size]
					]
				]);
				vectorSource.clear();
				vectorSource.addFeature(new Feature(polygon));
				updateGeometryFromFeature(polygon);
			});
		} else {
			drawInteraction = new Draw({
				source: vectorSource,
				type: 'Polygon',
				style: drawStyle
			});
			drawInteraction.on('drawend', (event) => {
				const geom = event.feature.getGeometry();
				if (!geom) return;
				vectorSource.clear();
				vectorSource.addFeature(event.feature);
				updateGeometryFromFeature(geom);
			});
		}

		map.addInteraction(drawInteraction);
	}

	function updateGeometryFromFeature(featureGeometry: Geometry) {
		const geometryObject = geoJSONFormatter.writeGeometryObject(featureGeometry, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
		});
		manualUpdate = true;
		geometry = structuredClone(geometryObject);
		emitChange(geometry);
		manualUpdate = false;
	}

	function renderGeometry(geojson: GeoJSONGeometry | null) {
		if (!geojson || !vectorSource || !map) return;
		try {
			vectorSource.clear();
			const geometryObj = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
			const olGeometry = geoJSONFormatter.readGeometry(geometryObj, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
			const feature = new Feature(olGeometry);
			vectorSource.addFeature(feature);
			
			// Zoom to the geometry extent (automatically adjusts based on size)
			const extent = olGeometry.getExtent();
			if (extent) {
				map.getView().fit(extent, {
					padding: [80, 80, 80, 80],
					duration: 500
				});
			}
		} catch (error) {
			console.error('Unable to render geometry', error);
		}
	}

	function clearGeometry() {
		vectorSource?.clear();
		geometry = null;
		emitChange(null);
	}

	// Support both `on:change` (legacy) and an `onchange` prop (runes-mode parents)
	function emitChange(value: GeoJSONGeometry | null) {
		dispatch('change', { geometry: value });
		onchange?.(new CustomEvent('change', { detail: { geometry: value } }));
	}
</script>

<div class="geometry-editor space-y-3">
	{#if showToolbar}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<span class="eyebrow">Draw</span>
				<div class="seg">
					<button type="button" aria-pressed={drawMode === 'polygon'} onclick={() => (drawMode = 'polygon')}>
						Polygon
					</button>
					<button type="button" aria-pressed={drawMode === 'point'} onclick={() => (drawMode = 'point')}>
						Quick point
					</button>
				</div>
			</div>
			<button type="button" class="btn btn-sm btn-quiet" onclick={clearGeometry}>Clear</button>
		</div>
	{/if}
	<div class="geometry-editor__map map-frame" bind:this={mapEl} style={`height:${height}`}></div>
</div>

<style>
	.geometry-editor__map {
		width: 100%;
		min-height: 300px;
		cursor: crosshair;
	}
</style>
