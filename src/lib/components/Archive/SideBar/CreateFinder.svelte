
<script lang="ts">
    import { createFinderGeoJson } from '$lib/stores/archive_store'; 
	import { onDestroy } from 'svelte';
    import { Plus } from '@lucide/svelte';

    let geojson: string = $state("");
    const unsubscribe = createFinderGeoJson.subscribe(value => {
        geojson = value;
    });
    onDestroy(() => {
        unsubscribe();
    });
</script>


<div class="space-y-4 animate-fadeIn">
    <label class="field">
        <span>Name</span>    
        <input class="input" name="finderName" title="Finder Name" type="text" placeholder="My Finder Name" value='' />
    </label>
    
    <label class="field">
        <span>GeoJSON</span>
        <textarea
            class="input font-mono text-xs"
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
    
    <label class="field">    
        <span>Start Date</span>
        <input class="input" name="startDate" title="Start Date" type="datetime-local" />
    </label>
    
    <label class="field">    
        <span>End Date</span>
        <input class="input" name="endDate" title="End Date" type="datetime-local" />
    </label>
    
    <button class="btn btn-primary w-full" type="submit">
        <Plus size={14} strokeWidth={1.5} />
        Create Finder
    </button>
</div>