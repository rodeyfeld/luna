
<script lang="ts">
    import { createFinderGeoJson } from '$lib/stores/archive_store'; 
	import { onDestroy } from 'svelte';

    let geojson: string = $state("");
    const unsubscribe = createFinderGeoJson.subscribe(value => {
        geojson = value;
    });
    onDestroy(() => {
        unsubscribe();
    });
</script>


<label class="label">
    <span>Name</span>    
    <input class="input" name="finderName" title="Finder Name" type="text" placeholder="My Finder Name" value='' />

</label>
<label class="label">
    <span>GEOJSON</span>
    <textarea
    class="input"
    name="geojson"
    title="Coordinates"
    rows="10"
    placeholder="Enter your GeoJSON here..."
>
    {geojson || JSON.stringify(
                    {"geometry": {
                        "coordinates": [
                            32.12890625000006,
                            31.578535426473053
                        ],
                        "type": "Point"
                    }})
                
    }
</textarea>
</label>
<label>    
    <span>Start Date</span>
    <input class="input" name="startDate" title="Start Date"  type="datetime-local" />
</label>
<label>    
    <span>End Date</span>
    <input class="input" name="endDate"  title="End Date" type="datetime-local" />
</label>
<div class="py-4">
    <button class="btn variant-filled-primary w-full p-4" type="submit">Create Finder</button>
</div>