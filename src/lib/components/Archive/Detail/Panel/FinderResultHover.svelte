<script lang="ts">
	import { page } from '$app/stores';
    import { selectedArchiveResultGeoJson } from '$lib/stores/archive_store';
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { type Geometry } from 'ol/geom';
    import GeoJSON from 'ol/format/GeoJSON';
	export let finderResult: any;
	const popupFocusClick: PopupSettings = {
	event: 'focus-click',
	target: `popupFocusClick-${ finderResult.id }`,
	placement: 'left'
};
function handleClick() {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(finderResult.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
	}

</script>

<button use:popup={popupFocusClick} on:click={handleClick}>
    <span class="badge bg-primary-500">{finderResult.sensor_type}</span>
    <span class="flex-auto">{finderResult.collection}</span>
</button>
<div class="card p-4 w-72 shadow-xl" data-popup="popupFocusClick-{finderResult.id}">
	<div>
		<img class="h-auto max-w-full rounded-lg" 
            src="{finderResult.thumbnail}" alt="">
	</div>
</div>


