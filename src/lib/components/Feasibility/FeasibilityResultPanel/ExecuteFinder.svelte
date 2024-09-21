<script>
    export let finder_data;
</script>
<div class="bg-surface-500/30 p-4">        
    <div class="w-full grid grid-cols-10 gap-2" >
        <div class="col-span-8">
            <span>{finder_data.id}:</span> 
        </div>
        <div>
            <button class="btn variant-filled-primary" type="submit">Execute Finder</button>
        </div>
    </div>
</div>