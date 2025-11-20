<script lang="ts">

    let { finderData } = $props();
</script>
<div class="p-4 animate-fadeIn">        
    <div class="w-full grid grid-cols-10 gap-4 items-center" >
        <div class="col-span-1 flex">
            <span class="badge variant-glass-tertiary justify-center animate-scaleIn">
                <i class="text-2xl px-1 fa-solid fa-book-atlas"></i>
                Imagery Finder
            </span>
        </div>
        <div class="col-span-5">
            <h1 class="h2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">{finderData.name}</h1>
        </div>
        <div class="col-span-4">
            <form method="POST" action="?/execute">
                <div class="w-full grid grid-cols-4 gap-2" >
                    <div class="col-span-2">
                        <select name="study_name" class="select transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500">
                            {#each finderData.study_options as study_option}
                                <option value={study_option["study_name"]}>
                                    study: {study_option["study_name"]}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <div class="col-span-2">
                        <input name="imagery_finder_id" class="input disabled hidden" value={finderData.id} type="text" />
                        <button class="btn variant-filled-primary w-full transition-smooth hover:scale-105 hover:shadow-xl">
                            <i class="fa-solid fa-play mr-2"></i>
                            Execute Study
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>