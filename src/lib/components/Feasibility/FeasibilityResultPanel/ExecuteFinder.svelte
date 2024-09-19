<script>
    export let finder;
</script>
<div class="bg-surface-500/30 p-4">        
    <div class="w-full grid grid-cols-[auto_1fr_auto] gap-2" >
        <div>
            <span>{finder}:</span> 
        </div>
        <div>
            <button class="btn variant-filled-primary" type="submit">Execute Finder</button>
        </div>
    </div>
</div>