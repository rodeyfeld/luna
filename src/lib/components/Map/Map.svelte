<script lang="ts">
  import { onMount } from 'svelte';
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import TileLayer from 'ol/layer/Tile.js';
  import OSM from 'ol/source/OSM.js';
  import { Vector as VectorLayer } from 'ol/layer.js';
  import { Vector as VectorSource } from 'ol/source.js';
  import { Draw, Modify, Snap } from 'ol/interaction.js';
  import { Point, Polygon, type Geometry } from 'ol/geom';
  import { Feature } from 'ol';
  import GeoJSON from 'ol/format/GeoJSON';
  import { geoJsonStore } from '$lib/stores/archive_store';
    
  const tileLayer = new TileLayer({
    source: new OSM(),
  });

  const vectorSource = new VectorSource({ wrapX: false });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  var map: Map;
  let draw; // to keep track of the draw interaction
  let currentPoint: Feature<Geometry>; // to store the currently drawn point
  let polygonFeature: Feature<Geometry>; // to store the currently drawn point

  onMount(() => {
    map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1,
        projection: 'EPSG:4326',
      }),
      layers: [tileLayer, vectorLayer],
      target: 'map',
    });

    const modify = new Modify({ source: vectorSource });
    map.addInteraction(modify);
    // Listen for feature modifications
    modify.on('modifyend', function (event) {
        const geojsonFormat = new GeoJSON();
        const modifiedFeatures = event.features;

        modifiedFeatures.forEach((feature: Feature) => {
            const geometry = feature.getGeometry() as Geometry;
            const geojson = geojsonFormat.writeGeometry(geometry);
            // Update the store with the modified feature's GeoJSON
            console.log(feature)
            geoJsonStore.set(geojson);
        });
    });
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
  #map {
    height: 100%;
    width: 100%;
  }
</style>
<div id="map" class="w-full h-full"></div>
