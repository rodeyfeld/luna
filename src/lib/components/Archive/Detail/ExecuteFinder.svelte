<script>

    export let finderData;
</script>
<div class="bg-surface-500/30 p-4">        
    <div class="w-full grid grid-cols-10 gap-2" >
        <div class="col-span-6">
            <h1 class="h1">Archive Finder {finderData.id}</h1> 
        </div>
        <div class="col-span-4">
            <form method="POST" action="?/execute">
                <div class="w-full grid grid-cols-4 gap-2" >
                    <div class="col-span-2">
                        <select class="w-full">
                        {#each finderData.study_options as study_option}
                            <option value={study_option["study_name"]}>
                                {study_option["study_name"]}
                            </option>
                        {/each}
                        </select>
                    </div>
                    <div class="col-span-1 flex items-center">
                        <input name="archive_finder_id" class="input disabled hidden" value={finderData.id} type="text" />
                        <button class="btn variant-filled-primary">Execute Finder</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>