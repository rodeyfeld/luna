<script lang="ts">
    const pinwheel = '/pinwheel.svg';
 </script>
<style>
    #hero-lunalogo {
        width: 500px;
        height: 500px;
        filter: drop-shadow(0 0 60px rgba(200, 210, 230, 0.4));
        animation: rotate-moon 120s linear infinite;
        opacity: 0.95;
    }
    #hero-lunalogo:hover {
        animation: rotate-moon-fast 20s linear infinite;
        opacity: 1;
    }
    #hero {
		background-image:
			radial-gradient(at 59% 99%, rgba(var(--color-surface-500) / 0.33) 0px, transparent 50%),
			radial-gradient(at 0% 1%, rgba(var(--color-primary-500) / 0.33) 0px, transparent 50%);
	}
    @keyframes rotate-moon {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes rotate-moon-fast {
        from { transform: rotate(0deg) scale(1.05); }
        to { transform: rotate(360deg) scale(1.05); }
    }
</style>
<div id="hero" class="section-container w-full mx-auto p-24 py-16 md:py-24">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
        <!-- Info -->
        <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4 animate-fadeIn">
    
            <h1 class="h1">LUNA</h1>
            <p class="!text-xl max-w-[475px]">
                Create archive studies in moments using the power of satellites
            </p>
            <div class="flex gap-4">
                <a href="/archive/create" class="btn variant-filled-primary transition-smooth hover:scale-105 hover:shadow-xl">
                    <span>Get Started</span>
                    <i class="fa-solid fa-arrow-right-long"></i>
                </a>
                <a href="https://github.com/rodeyfeld/luna" class="btn variant-soft-primary transition-smooth hover:scale-105">Learn More</a>
            </div>
        </div>
    
        <!-- Components -->
        <div class="hidden md:flex w-full max-w-[650px] mx-auto mt-20 animate-scaleIn justify-center items-center">
             <img id="hero-lunalogo" src={pinwheel} alt="Luna - Satellite Imagery Platform" />
        </div>
    </div>
</div>
