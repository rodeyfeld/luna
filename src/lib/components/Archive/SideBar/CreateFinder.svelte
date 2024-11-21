
<script lang="ts">
    import { createFinderGeoJson } from '$lib/stores/archive_store'; 
	import { onDestroy, onMount } from 'svelte';

    let geojson: string = "";
	let time = new Date();
	// these automatically update when `time`
	// changes, because of the `$:` prefix
	$: hours = time.getHours();
	$: minutes = time.getMinutes();
	$: seconds = time.getSeconds();

    // time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
    $: nowTimeStr = time.toISOString().slice(0, 16)
    const defaultEndTime = new Date()
    defaultEndTime.setMinutes(time.getMinutes() + 30)
    const defaultEndTimeStr = defaultEndTime.toISOString().slice(0, 16)
	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

    const unsubscribe = createFinderGeoJson.subscribe(value => {
        geojson = value; // Update local variable whenever the store value changes
    });

    // Clean up the subscription on component destroy
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
    <input class="input" name="startDate" title="Start Date" value={nowTimeStr} type="datetime-local" />
</label>
<label>    
    <span>End Date</span>
    <input class="input" name="endDate"  title="End Date" value={defaultEndTimeStr} type="datetime-local" />
</label>
<div class="py-4">
    <button class="btn variant-filled-primary w-full p-4" type="submit">Create Finder</button>
</div>