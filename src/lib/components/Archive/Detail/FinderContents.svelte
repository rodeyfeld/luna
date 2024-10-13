<script>
    import FinderMap from "./FinderMap.svelte";
    export let finderData;
</script>

<label>    
    <span>Start Date</span>
    <input class="input" name="startDate" title="Start Date" value={finderData.start_date} type="datetime-local" />
</label>
<label>    
    <span>End Date</span>
    <input class="input" name="startDate" title="End Date" value={finderData.end_date} type="datetime-local" />
</label>
{finderData}
<FinderMap finderData={finderData}></FinderMap>