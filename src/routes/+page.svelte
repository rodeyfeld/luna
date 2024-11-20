<script>
    import img from '$lib/static/lunalogo.png'
 </script>
<style>
    #hero-lunalogo {
        width: 500px;
        height: 500px;
    }
</style>
<div class="section-container w-full max-w-7xl mx-auto p-4 py-16 md:py-24">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
        <!-- Info -->
        <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
    
            <h1 class="h1 text-9x1">LUNA</h1>
            <p class="!text-xl max-w-[475px]">
                Skeleton allows you to create adaptive and accessible interfaces for web apps of any shape or size.
            </p>
            <div class="flex gap-4">
                <a href="/docs/get-started" class="btn variant-filled-primary">
                    <span>Get Started</span>
                    <i class="fa-solid fa-arrow-right-long"></i>
                </a>
                <a href="/docs/introduction" class="btn variant-soft-primary">Learn More</a>
            </div>
        </div>
    
        <!-- Components -->
        <div class="hidden md:inline-block w-full max-w-[650px] mx-auto mt-20">
             <img id="hero-lunalogo" src={img} alt="lunalogo" />
        </div>
    </div>
</div>
