
<script>


	import { onMount } from 'svelte';

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
</script>

<label class="label">
    <span>Name</span>    
    <input class="input" name="finderName" title="Finder Name" type="text" placeholder="My Finder Name" value='' />

</label>
<label class="label">
    <span>Imagery</span>
    <select class="select" name="imageId" size="10" value="1">
        <!-- {#each images as image, i}
        <option value={image.id}>{image.id}| {image.name}</option>
        {/each} -->
    </select>
</label>
<label>    
    <span>Start Date</span>
    <input class="input" name="startDate" title="Start Date" value={nowTimeStr} type="datetime-local" />
</label>
<label>    
    <span>End Date</span>
    <input class="input" name="endDate"  title="End Date" value={defaultEndTimeStr} type="datetime-local" />
</label>
<button class="btn variant-filled-primary" type="submit">Create Finder</button>