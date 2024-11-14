<script lang="ts">
	import { page } from '$app/stores';
    import { selectedArchiveResultGeoJson } from '$lib/stores/archive_store';
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { type Geometry } from 'ol/geom';
    import GeoJSON from 'ol/format/GeoJSON';
	export let imageryResult: any;
	const popupFocusClick: PopupSettings = {
	event: 'focus-click',
	target: `popupFocusClick-${ imageryResult.id }`,
	placement: 'left'
};
function handleClick() {
		const geojsonFormat = new GeoJSON();
		const geometry = new GeoJSON().readGeometry(imageryResult.geometry);
		const geojson = geojsonFormat.writeGeometry(geometry)
		selectedArchiveResultGeoJson.set(geojson)
	}

</script>

<button use:popup={popupFocusClick} on:click={handleClick}>
    <span class="badge bg-primary-500">{imageryResult.sensor_type}</span>
    <span class="flex-auto">{imageryResult.collection}</span>
</button>
<div class="card p-4 w-72 shadow-xl" data-popup="popupFocusClick-{imageryResult.id}">
	<div>
		<img class="h-auto max-w-full rounded-lg" 
            src="{imageryResult.thumbnail}" alt="">
	</div>
</div>


