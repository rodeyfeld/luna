<script lang="ts">
    import Map from "./Map.svelte";
    let { finderData } = $props();
</script>

<label>    
    <span>Name</span>
    <input class="input" name="nane" title="Start Date" value={finderData.name} disabled />
</label>
<label>    
    <span>Start Date</span>
    <input class="input" name="startDate" title="Start Date" value={finderData.start_date} disabled />
</label>
<label>    
    <span>End Date</span>
    <input class="input" name="startDate" title="End Date" value={finderData.end_date} disabled />
</label>
<Map finderData={finderData}></Map>