
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


<div class="space-y-4 animate-fadeIn">
    <label class="label">
        <span class="font-semibold">Name</span>    
        <input class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500" name="finderName" title="Finder Name" type="text" placeholder="My Finder Name" value='' />
    </label>
    
    <label class="label">
        <span class="font-semibold">GEOJSON</span>
        <textarea
            class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500"
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
    
    <label class="label">    
        <span class="font-semibold">Start Date</span>
        <input class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500" name="startDate" title="Start Date" type="datetime-local" />
    </label>
    
    <label class="label">    
        <span class="font-semibold">End Date</span>
        <input class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500" name="endDate" title="End Date" type="datetime-local" />
    </label>
    
    <button class="btn variant-filled-primary w-full p-4 transition-smooth hover:scale-105 hover:shadow-xl" type="submit">
        <i class="fa-solid fa-plus mr-2"></i>
        Create Finder
    </button>
</div>