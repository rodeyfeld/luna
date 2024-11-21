<script>

    export let finderData;
</script>
<div class="p-4">        
    <div class="w-full grid grid-cols-10" >
        <div class="col-span-1 flex">
            <span class="badge variant-filled-tertiary justify-center"><i class="text-2xl fa-solid fa-book-atlas"></i> Archive Finder</span>
        </div>
        <div class="col-span-5">
            <h1 class="h2"> {finderData.name}</h1>
        </div>
        <div class="col-span-4">
            <form method="POST" action="?/execute">
                <div class="w-full grid grid-cols-4 gap-2" >
                    <div class="col-span-2 ">
                        <select name="study_name " class="w-full bg-primary-600 text-black">
                        {#each finderData.study_options as study_option}
                            <option value={study_option["study_name"]}>
                                study: {study_option["study_name"]}
                            </option>
                        {/each}
                        </select>
                    </div>
                    <div class="col-span-1">
                        <input name="archive_finder_id" class="input disabled hidden" value={finderData.id} type="text" />
                        <button class="btn variant-filled-primary">Execute Finder Study</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>