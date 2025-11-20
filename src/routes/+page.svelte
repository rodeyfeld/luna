<script lang="ts">
    import img from '$lib/static/lunalogo.png'
 </script>
<style>
    #hero-lunalogo {
        width: 500px;
        height: 500px;
    }
    #hero {
		background-image:
			radial-gradient(at 59% 99%, rgba(var(--color-surface-500) / 0.33) 0px, transparent 50%),
			radial-gradient(at 0% 1%, rgba(var(--color-primary-500) / 0.33) 0px, transparent 50%);
	}
</style>
<div id="hero" class="section-container w-full mx-auto p-24 py-16 md:py-24">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
        <!-- Info -->
        <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
    
            <h1 class="h1">LUNA</h1>
            <p class="!text-xl max-w-[475px]">
                Create archive studies in moments using the power of satellites
            </p>
            <div class="flex gap-4">
                <a href="/archive/create" class="btn variant-filled-primary">
                    <span>Get Started</span>
                    <i class="fa-solid fa-arrow-right-long"></i>
                </a>
                <a href="https://github.com/rodeyfeld/luna" class="btn variant-soft-primary">Learn More</a>
            </div>
        </div>
    
        <!-- Components -->
        <div class="hidden md:inline-block w-full max-w-[650px] mx-auto mt-20">
             <img id="hero-lunalogo" src={img} alt="lunalogo" />
        </div>
    </div>
</div>
