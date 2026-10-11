<script lang="ts">
  import { onMount } from 'svelte';
  import { alpha, createSimpleGeometryMap, mapColors } from '$lib/components/Map/MapUtils';
  import { normalizeGeometry } from '$lib/utils/geometry';
  import type Map from 'ol/Map';
  import 'ol/ol.css';

  interface Props {
    geometry: any;
    width?: string;
    height?: string;
  }

  let { geometry, width = '120px', height = '80px' }: Props = $props();
  
  let mapElement: HTMLDivElement | undefined = $state();
  let map: Map | undefined = $state();
  let isVisible = $state(false);

  onMount(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !map) {
            isVisible = true;
            initMap();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (mapElement) {
      observer.observe(mapElement);
    }

    return () => {
      if (mapElement) {
        observer.unobserve(mapElement);
      }
      if (map) {
        map.setTarget(undefined);
      }
    };
  });

  function initMap() {
    if (!mapElement || !geometry || map) return;

    try {
      // Parse geometry if it's a string
      const parsedGeometry = typeof geometry === 'string' 
        ? JSON.parse(geometry) 
        : geometry;
      
      const normalizedGeometry = normalizeGeometry(parsedGeometry);
      
      if (!normalizedGeometry) {
        console.warn('Failed to normalize geometry for minimap');
        return;
      }

      map = createSimpleGeometryMap(mapElement, normalizedGeometry, {
        fillColor: alpha(mapColors.sodium, 0.12),
        strokeColor: mapColors.sodium,
        strokeWidth: 1.25,
        padding: [14, 14, 14, 14],
        duration: 0, // No animation for minimap
        labels: false,
      });
      
      // Disable all interactions for minimap
      map.getInteractions().forEach(interaction => {
        map?.removeInteraction(interaction);
      });
      
      // Remove controls
      map.getControls().forEach(control => {
        map?.removeControl(control);
      });
    } catch (err) {
      console.error('Failed to create minimap:', err, geometry);
    }
  }
</script>

<div
  bind:this={mapElement}
  style="width: {width}; height: {height}; min-width: {width}; min-height: {height};"
  class="minimap overflow-hidden rounded border border-line bg-night"
></div>


<style>
  /* Thumbnails are glanceable, not interactive: hide attribution and controls */
  .minimap :global(.ol-attribution),
  .minimap :global(.ol-zoom),
  .minimap :global(.ol-rotate) {
    display: none;
  }
</style>
