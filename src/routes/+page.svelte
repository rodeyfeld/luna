<script lang="ts">
  import { ArrowRight, ArrowUpRight } from "@lucide/svelte";
  import MoonPhase from "$lib/components/shared/MoonPhase.svelte";
  import type { Phase } from "$lib/utils/status";

  const steps: { phase: Phase; title: string; body: string }[] = [
    {
      phase: "new",
      title: "Mark an area",
      body: "Draw a polygon or drop a point anywhere on Earth. It becomes a saved area of interest.",
    },
    {
      phase: "crescent",
      title: "Set a finder",
      body: "Give the area a window of time, a cloud ceiling, a resolution, and the sensors you care about.",
    },
    {
      phase: "gibbous",
      title: "Run a study",
      body: "Luna searches the public archives for every capture that crossed your area in that window.",
    },
    {
      phase: "full",
      title: "Read the results",
      body: "Browse footprints on the map with dates, sources, cloud cover and previews side by side.",
    },
  ];

  const index = [
    { href: "/areas-of-interest", numeral: "I", title: "Areas of interest", body: "Draw and manage the places you watch" },
    { href: "/dashboard", numeral: "II", title: "Finders", body: "Search windows and the studies run against them" },
    { href: "/providers", numeral: "III", title: "Sources", body: "Public archives and their integrations" },
  ];

  // Graticule for the hero globe: meridians as ellipses, parallels as chords
  const meridians = [0.2, 0.45, 0.7, 0.9];
  const parallels = [-0.66, -0.33, 0, 0.33, 0.66];
</script>

<div class="flex flex-col gap-24 pb-12">
  <!-- Hero -->
  <section class="grid items-center gap-12 pt-6 lg:grid-cols-[1.1fr_1fr] lg:pt-12">
    <div class="animate-fadeIn">
      <p class="eyebrow">Pinwheel Labs</p>
      <h1 class="display mt-5 text-[6.5rem] sm:text-[9rem]">luna</h1>
      <p class="mt-6 max-w-lg text-lg leading-relaxed text-dust">
        Mark a place on Earth, choose a window of time, and find every public satellite capture that passed
        overhead.
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <a href="/areas-of-interest" class="btn btn-primary">
          Mark an area
          <ArrowRight size={14} strokeWidth={1.5} />
        </a>
        <a href="/dashboard" class="btn">Open finders</a>
      </div>
    </div>

    <div class="hidden justify-center animate-scaleIn stagger-2 lg:flex" aria-hidden="true">
      <svg viewBox="-200 -200 400 400" class="h-[26rem] w-[26rem] overflow-visible">
        <g fill="none" style="stroke: var(--color-line-strong)" stroke-width="1">
          <circle r="170" />
          {#each meridians as m}
            <ellipse rx={170 * m} ry="170" />
          {/each}
          {#each parallels as p}
            <line x1={-170 * Math.sqrt(1 - p * p)} x2={170 * Math.sqrt(1 - p * p)} y1={170 * p} y2={170 * p} />
          {/each}
          <line x1="0" x2="0" y1="-170" y2="170" />
        </g>
        <!-- an orbit, tilted, with one bright pass -->
        <g transform="rotate(-24)">
          <ellipse rx="196" ry="58" fill="none" style="stroke: var(--color-shade)" stroke-width="1" stroke-dasharray="2 5" />
          <circle r="3.5" style="fill: var(--color-sodium)">
            <animateMotion dur="14s" repeatCount="indefinite" path="M 196 0 A 196 58 0 1 1 -196 0 A 196 58 0 1 1 196 0" />
          </circle>
        </g>
        <image href="/pinwheel.svg" x="-72" y="-72" width="144" height="144" class="hero-moon" />
      </svg>
    </div>
  </section>

  <!-- Method -->
  <section class="animate-fadeIn stagger-3">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <p class="eyebrow">Method</p>
        <h2 class="display mt-3 text-4xl sm:text-5xl">How it works</h2>
      </div>
      <p class="max-w-sm text-sm text-haze">Four steps from a place on the map to the imagery that covers it.</p>
    </div>

    <!-- gap-px over a line-colored backdrop draws hairlines between cells at every breakpoint -->
    <ol class="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
      {#each steps as step, i}
        <li class="bg-night py-8 sm:px-6">
          <div class="flex items-center justify-between">
            <MoonPhase phase={step.phase} size={22} class="text-moon" />
            <span class="readout text-xs text-shade">0{i + 1}</span>
          </div>
          <h3 class="mt-6 text-lg font-medium">{step.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-haze">{step.body}</p>
        </li>
      {/each}
    </ol>
  </section>

  <!-- Index -->
  <section class="animate-fadeIn stagger-4">
    <p class="eyebrow border-b border-line pb-4">Index</p>
    <ul>
      {#each index as entry}
        <li>
          <a href={entry.href} class="group flex items-center gap-6 border-b border-line py-6 transition-colors">
            <span class="readout w-10 text-sm text-shade transition-colors group-hover:text-sodium">
              {entry.numeral}
            </span>
            <span class="flex-1">
              <span class="display block text-3xl transition-colors group-hover:text-white">{entry.title}</span>
              <span class="mt-1 block text-sm text-haze">{entry.body}</span>
            </span>
            <ArrowUpRight
              size={20}
              strokeWidth={1.25}
              class="text-shade transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-moon"
            />
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .hero-moon {
    transform-box: fill-box;
    transform-origin: center;
    animation: rotate-moon 90s linear infinite;
  }
</style>
