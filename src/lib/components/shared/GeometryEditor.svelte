<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from 'svelte';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import VectorLayer from 'ol/layer/Vector';
	import { Vector as VectorSource } from 'ol/source';
	import OSM from 'ol/source/OSM';
	import { Draw, Modify, Snap } from 'ol/interaction';
	import GeoJSON from 'ol/format/GeoJSON';
	import { Feature } from 'ol';
	import { Polygon, type Geometry } from 'ol/geom';

	type GeoJSONGeometry = ReturnType<GeoJSON['writeGeometryObject']>;

	export let geometry: GeoJSONGeometry | null = null;
	export let drawMode: 'polygon' | 'point' = 'polygon';
	export let height = '420px';
	export let showToolbar = true;
	export let convertPointSize = 0.5; // degrees

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
			source: vectorSource
		});

		map = new Map({
			target: mapEl,
			layers: [
				new TileLayer({
					source: new OSM()
				}),
				vectorLayer
			],
			view: new View({
				center: [0, 0],
				zoom: 2,
				projection: 'EPSG:4326'
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
				type: 'Point'
			});
			drawInteraction.on('drawend', (event) => {
				const point = event.feature.getGeometry();
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
				type: 'Polygon'
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
		dispatch('change', { geometry });
		manualUpdate = false;
	}

	function renderGeometry(geojson: GeoJSONGeometry | null) {
		if (!geojson || !vectorSource) return;
		try {
			vectorSource.clear();
			const geometryObj = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
			const olGeometry = geoJSONFormatter.readGeometry(geometryObj, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
			vectorSource.addFeature(new Feature(olGeometry));
		} catch (error) {
			console.error('Unable to render geometry', error);
		}
	}

	function clearGeometry() {
		vectorSource?.clear();
		geometry = null;
		dispatch('change', { geometry: null });
	}
</script>

<div class="geometry-editor space-y-3">
	{#if showToolbar}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<span class="text-sm text-surface-400">Draw Mode:</span>
				<div class="btn-group">
					<button
						type="button"
						class={`btn btn-sm ${drawMode === 'polygon' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
						onclick={() => (drawMode = 'polygon')}
					>
						Polygon
					</button>
					<button
						type="button"
						class={`btn btn-sm ${drawMode === 'point' ? 'variant-filled-primary' : 'variant-soft-surface'}`}
						onclick={() => (drawMode = 'point')}
					>
						Quick Point
					</button>
				</div>
			</div>
			<button type="button" class="btn btn-sm variant-ghost-error" onclick={clearGeometry}>
				Clear
			</button>
		</div>
	{/if}
	<div class="geometry-editor__map" bind:this={mapEl} style={`height:${height}`}></div>
</div>

<style>
	.geometry-editor__map {
		width: 100%;
		min-height: 300px;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
	}
</style>

