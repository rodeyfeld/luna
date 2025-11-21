<script lang="ts">
  import { goto } from "$app/navigation";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";

  const pinwheel = "/pinwheel.svg";
</script>

<div class="page-stack">
  <!-- Hero Section -->
  <SectionPanel variant="hero" padding="px-4 sm:px-8 py-16 md:py-24">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Hero Content -->
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 animate-fadeIn">
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl font-bold">
              <span class="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                LUNA
              </span>
            </h1>
            <p class="text-2xl md:text-3xl font-semibold text-surface-900 dark:text-surface-50">
              Archive Imagery Finder
            </p>
            <p class="text-lg text-surface-600 dark:text-surface-300 max-w-[550px]">
              Define areas of interest, search satellite archives, and run studies across multiple imagery providers.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onclick={() => goto("/dashboard")}
              class="btn variant-filled-primary text-lg px-8 py-4 transition-smooth hover:scale-105"
            >
              <span>View Finders</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onclick={() => goto("/archive/create")}
              class="btn variant-soft-primary text-lg px-8 py-4 transition-smooth hover:scale-105"
            >
              <span>Create Finder</span>
            </button>
          </div>
        </div>

        <!-- Hero Visual - THE SPINNING PINWHEEL! -->
        <div class="hidden lg:flex justify-center items-center animate-scaleIn">
          <img
            id="hero-lunalogo"
            src={pinwheel}
            alt="Luna - Archive Imagery Finder"
          />
        </div>
      </div>
    </div>
  </SectionPanel>

  <!-- How It Works -->
  <SectionPanel padding="px-4 sm:px-8 py-16">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">How It Works</h2>
      
      <div class="space-y-6">
        <div class="tile hover-lift">
          <div class="flex items-start gap-4">
            <div class="text-3xl">📍</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">1. Define Your Area of Interest</h3>
              <p class="text-surface-400">
                Create or select a geographic location - point, polygon, or any geometry.
              </p>
            </div>
          </div>
        </div>

        <div class="tile hover-lift">
          <div class="flex items-start gap-4">
            <div class="text-3xl">🔍</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">2. Create an Imagery Finder</h3>
              <p class="text-surface-400">
                Set date ranges and search parameters. Filter by cloud coverage, resolution, and sensor type.
              </p>
            </div>
          </div>
        </div>

        <div class="tile hover-lift">
          <div class="flex items-start gap-4">
            <div class="text-3xl">⚡</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">3. Execute Studies</h3>
              <p class="text-surface-400">
                Run archive lookup studies to search across multiple satellite imagery providers.
              </p>
            </div>
          </div>
        </div>

        <div class="tile hover-lift">
          <div class="flex items-start gap-4">
            <div class="text-3xl">📊</div>
            <div>
              <h3 class="text-xl font-semibold mb-2">4. View Results</h3>
              <p class="text-surface-400">
                Browse found imagery with collection details, dates, sensors, and providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <button
          onclick={() => goto("/archive/create")}
          class="btn variant-filled-primary"
        >
          Get Started
        </button>
      </div>
    </div>
  </SectionPanel>

  <!-- Quick Links -->
  <SectionPanel variant="muted" padding="px-4 sm:px-8 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/areas-of-interest" class="tile hover-lift text-center">
          <div class="text-3xl mb-2">🗺️</div>
          <h3 class="font-semibold mb-1">Areas of Interest</h3>
          <p class="text-sm text-surface-400">Manage locations</p>
        </a>
        <a href="/dashboard" class="tile hover-lift text-center">
          <div class="text-3xl mb-2">📡</div>
          <h3 class="font-semibold mb-1">Imagery Finders</h3>
          <p class="text-sm text-surface-400">View all finders</p>
        </a>
        <a href="/providers" class="tile hover-lift text-center">
          <div class="text-3xl mb-2">🛰️</div>
          <h3 class="font-semibold mb-1">Providers</h3>
          <p class="text-sm text-surface-400">Available sources</p>
        </a>
      </div>
    </div>
  </SectionPanel>
</div>
