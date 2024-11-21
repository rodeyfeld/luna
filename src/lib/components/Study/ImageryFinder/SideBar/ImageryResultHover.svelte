<script lang="ts">
    import { selectedArchiveResultGeoJson, selectedArchiveResultThumbnail } from '$lib/stores/archive_store';	
	import Overlay from 'ol/Overlay.js';
    import GeoJSON from 'ol/format/GeoJSON';
    let thumbnail: string = "";
	let coords: number[];
    export let overlay: Overlay;

	const unsubscribe = selectedArchiveResultThumbnail.subscribe(value => {
		thumbnail = value;
		if (value) {
			overlay.setPosition(coords);
		}
	});
	const unsubscribeGeoJSON = selectedArchiveResultGeoJson.subscribe(value => {
		if (value){
			const geometry = new GeoJSON().readGeometry(value);
			const extent = geometry.getExtent();
			coords = [extent[2], extent[3]]
		}
	})
</script>

<!-- Popup HTML structure -->
<div id="image-popup">
    <div class="card p-4 w-72 shadow-xl">
        <img
            class="h-auto max-w-full rounded-lg"
            src={thumbnail}
            alt="Selected thumbnail"
        />
    </div>
</div>
<style>
	    #image-popup {
        position: absolute;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px;
        bottom: 12px;
        left: -50px;
      }
      #image-popup:after, #image-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      #image-popup:after {
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      #image-popup:before {
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }

</style>