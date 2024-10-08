<script>

    export let finder_data;
</script>
<div class="bg-surface-500/30 p-4">        
    <div class="w-full grid grid-cols-10 gap-2" >
        <div class="col-span-8">
            <h1 class="h1">Archive Finder {finder_data.id}</h1> 
        </div>
        <div>
            <form method="POST" action="?/execute">
                <input name="archive_finder_id" class="input disabled hidden" value={finder_data.id} type="text" />
                <button class="btn variant-filled-primary">Execute Finder</button>
            </form>
        </div>
    </div>
</div>