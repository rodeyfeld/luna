<script lang="ts">
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import SectionPanel from "$lib/components/shared/SectionPanel.svelte";

  const pinwheel = "/pinwheel.svg";
  const apiDocsUrl =
    (env.PUBLIC_AUGUR_URL || "http://localhost:8000") + "/api/docs";

  const features = [
    {
      icon: "🗺️",
      title: "Interactive Mapping",
      description:
        "Draw areas of interest directly on the map. Support for points, polygons, and complex geometries.",
    },
    {
      icon: "🛰️",
      title: "Multi-Provider Search",
      description:
        "Search across multiple satellite imagery providers in a single query. Get comprehensive coverage.",
    },
    {
      icon: "📊",
      title: "Study Execution",
      description:
        "Run advanced studies like tree coverage analysis, wind speed detection, and custom analytics.",
    },
    {
      icon: "⚡",
      title: "Real-Time Status",
      description:
        "Track your archive searches and studies in real-time with detailed progress monitoring.",
    },
    {
      icon: "🎯",
      title: "Smart Filtering",
      description:
        "Filter by resolution, cloud coverage, sensor type, and custom parameters for precise results.",
    },
    {
      icon: "📈",
      title: "Results Visualization",
      description:
        "View imagery results on an interactive map with thumbnails, metadata, and timeline controls.",
    },
  ];

  const useCases = [
    {
      title: "Environmental Monitoring",
      description:
        "Track deforestation, water levels, and ecosystem changes over time.",
      tags: ["Climate", "Conservation", "Research"],
    },
    {
      title: "Urban Planning",
      description:
        "Analyze urban growth, infrastructure development, and land use patterns.",
      tags: ["Development", "Infrastructure", "Government"],
    },
    {
      title: "Agriculture Analysis",
      description:
        "Monitor crop health, irrigation patterns, and agricultural productivity.",
      tags: ["Farming", "Food Security", "Sustainability"],
    },
    {
      title: "Disaster Response",
      description:
        "Assess damage, plan recovery efforts, and track environmental events.",
      tags: ["Emergency", "Relief", "Assessment"],
    },
  ];
</script>

<div class="page-stack">
<!-- Hero Section -->
<SectionPanel variant="hero" padding="px-4 sm:px-8 py-16 md:py-24" tag="section" id="hero">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Hero Content -->
      <div
        class="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 animate-fadeIn"
      >
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold">
            <span
              class="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
            >
              LUNA
            </span>
          </h1>
          <p
            class="text-2xl md:text-3xl font-semibold text-surface-900 dark:text-surface-50"
          >
            Satellite Imagery Intelligence
          </p>
          <p
            class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-[550px]"
          >
            Search, analyze, and visualize satellite imagery from multiple
            providers. Create archive studies, execute advanced analytics, and
            gain insights from space-based data.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onclick={() => goto("/dashboard")}
            class="btn variant-filled-primary text-lg px-8 py-4 transition-smooth hover:scale-105 hover:shadow-xl"
          >
            <span>Open Dashboard</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          <button
            onclick={() => goto("/archive/create")}
            class="btn variant-soft-primary text-lg px-8 py-4 transition-smooth hover:scale-105"
          >
            <span>Create Search</span>
          </button>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-6 pt-8 w-full max-w-md">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-500">5+</div>
            <div class="text-sm text-surface-600 dark:text-surface-300">Providers</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-secondary-500">∞</div>
            <div class="text-sm text-surface-600 dark:text-surface-300">Imagery</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-tertiary-500">⚡</div>
            <div class="text-sm text-surface-600 dark:text-surface-300">Fast</div>
          </div>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="hidden lg:flex justify-center items-center animate-scaleIn">
        <img
          id="hero-lunalogo"
          src={pinwheel}
          alt="Luna - Satellite Imagery Platform"
        />
      </div>
    </div>
  </div>
</SectionPanel>

<!-- Features Section -->
<SectionPanel padding="px-4 sm:px-8 py-16">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
      <p class="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
        Everything you need to search, analyze, and visualize satellite imagery
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each features as feature}
        <div
          class="card p-6 hover-lift animate-fadeIn bg-surface-100 dark:bg-surface-800"
        >
          <div class="text-4xl mb-4">{feature.icon}</div>
          <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
          <p class="text-surface-600 dark:text-surface-300">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</SectionPanel>

<!-- Use Cases Section -->
<SectionPanel variant="muted" padding="px-4 sm:px-8 py-16">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
      <p class="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
        Luna adapts to your specific satellite imagery needs
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each useCases as useCase}
        <div class="card p-8 hover-lift animate-fadeIn variant-glass">
          <h3 class="text-2xl font-semibold mb-3">{useCase.title}</h3>
          <p class="text-surface-600 dark:text-surface-300 mb-4">{useCase.description}</p>
          <div class="flex flex-wrap gap-2">
            {#each useCase.tags as tag}
              <span class="badge variant-soft-primary">{tag}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</SectionPanel>

<!-- CTA Section -->
<SectionPanel
  variant="hero"
  padding="px-4 sm:px-8 py-16"
>
  <div class="max-w-4xl mx-auto text-center text-white">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="text-lg md:text-xl mb-8 opacity-90">
      Start searching satellite imagery archives and running studies in minutes
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto("/dashboard")}
        class="btn variant-filled-surface text-lg px-8 py-4 hover:scale-105 transition-smooth"
      >
        Go to Dashboard
      </button>
      <a
        href={apiDocsUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="btn variant-soft text-lg px-8 py-4 hover:scale-105 transition-smooth bg-white/10 text-white hover:bg-white/20"
      >
        <span>View API Docs</span>
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  </div>
</SectionPanel>
</div>
