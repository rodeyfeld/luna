
<script>
    export let images;
</script>

<label class="label">
    <span>Imagery</span>

    <select class="select" size="10" value="1">
        {#each images as image, i}
        <option>{image.id}| {image.name}</option>
        {/each}
    </select>
</label>
<label>    
    <span>Start Date</span>
    <input class="input" title="Start Date" type="datetime-local" />
</label>
<label>    
    <span>End Date</span>
    <input class="input" title="End Date" type="datetime-local" />
</label>