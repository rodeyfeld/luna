<script lang="ts">
    import { onMount } from 'svelte';
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from 'ol/source/OSM.js';
    import { Vector as VectorLayer } from 'ol/layer.js';
    import { Vector as VectorSource } from 'ol/source.js';
    import { Feature } from 'ol';
    import { Point, Polygon, type Geometry } from 'ol/geom';
    import GeoJSON from 'ol/format/GeoJSON';
    import { Draw, Modify, Snap } from 'ol/interaction.js';

    import { geoJsonStore } from '$lib/stores/archive_store';
    import { Fill, Stroke, Style} from 'ol/style.js';
    const fill = new Fill({
        color: 'rgba(255,255,255,0.4)',
    });
    const stroke = new Stroke({
        color: '#3399CC',
        width: 1.25,
    });
    export let finders;
    const features = finders.map((finderResult: { geometry: any; }) => {
        const geometry = new GeoJSON().readGeometry(finderResult.geometry);
        return new Feature(geometry)
    })

    const tileLayer = new TileLayer({
        source: new OSM(),
    });
    const vectorSource = new VectorSource({ 
        features: features,
        wrapX: false 
    });

    const featureStyle = new Style({
        fill: new Fill({
            color: 'rgba(0, 255, 255, .1)', // Fill color
        }),
        stroke: new Stroke({
            color: '#0000FF', // Stroke color
            width: 2, // Stroke width
        }),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: featureStyle,
    });
    let draw; 
    var map: Map;
    let currentPoint: Feature<Geometry>;
    let polygonFeature: Feature<Geometry>;
    onMount(() => {
        map = new Map({
        view: new View({
            center: [0, 0],
            zoom: 1,
            projection: 'EPSG:4326',
        }),
        layers: [tileLayer, vectorLayer],
        target: 'archiveFinderMap',
        });



    const modify = new Modify({ source: vectorSource });
    map.addInteraction(modify);

    // Initialize draw interaction
    draw = new Draw({
      source: vectorSource,
      type: 'Point',
    });

    // Listen for drawend event
    draw.on('drawend', function (event) {
      // Clear the previous point if it exists
      if (currentPoint) {
        vectorSource.removeFeature(currentPoint);
      }      
      if (polygonFeature) {
        vectorSource.removeFeature(polygonFeature);
      }
      // Get the coordinates of the drawn point
      const pointGeometry = event.feature.getGeometry() as Point;
      const coordinates = pointGeometry.getCoordinates();

      // Create a square polygon around the point
      const size = 2; // size of the square (in degrees or suitable units)
      const squareCoords = [
        [coordinates[0] - size, coordinates[1] - size], // bottom left
        [coordinates[0] + size, coordinates[1] - size], // bottom right
        [coordinates[0] + size, coordinates[1] + size], // top right
        [coordinates[0] - size, coordinates[1] + size], // top left
        [coordinates[0] - size, coordinates[1] - size]  // closing the square
      ];

      const squarePolygon = new Polygon([squareCoords]);
      polygonFeature = new Feature(squarePolygon);

      // Add the polygon to the vector source
      vectorSource.addFeature(polygonFeature);
      const geojsonFormat = new GeoJSON();
      const geometry = polygonFeature.getGeometry() as Geometry;
      const geojson = geojsonFormat.writeGeometry(geometry);
      geoJsonStore.set(geojson)
      currentPoint = event.feature;
    });

    // Add interactions to the map
    map.addInteraction(draw);
    const snap = new Snap({ source: vectorSource });
    map.addInteraction(snap);

    });
</script>


<style>
    #archiveFinderMap {
      height: 100%;
      width: 100%;
    }
  </style>
  <div id="archiveFinderMap" class="w-full h-full"></div>

