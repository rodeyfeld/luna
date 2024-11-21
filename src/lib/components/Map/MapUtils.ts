import { Fill, Stroke, Style} from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile.js';
import { View } from 'ol';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Draw, Extent, Modify, Snap } from 'ol/interaction.js';
import { Polygon } from 'ol/geom';
import type { Writable } from 'svelte/store';
import {defaults as defaultInteractions} from 'ol/interaction.js';
import Collection from 'ol/Collection'

export function lunaMap(htmlTarget: string): Map {
    return new Map({
        view: new View({
            center: [0, 0],
            zoom: 1.1,
            projection: 'EPSG:4326',
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        target: htmlTarget,
    });
}

export function lunaLockedMap(htmlTarget: string): Map {
    return new Map({
        view: new View({
            center: [0, 0],
            zoom: 1.1,
            projection: 'EPSG:4326',
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        target: htmlTarget,
        interactions: new Collection()
    });
}

export function newBaseFeatureLayer(features: Array<Feature>): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: features
        }),
        style: new Style({
            fill: new Fill({
                color: 'rgba(0, 255, 255, .1)', 
            }),
            stroke: new Stroke({
                color: '#5f7b97', 
                width: 2, 
            }),
        })
    })
}


export function newHighlightFeatureLayer(): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: new Array<Feature>()
        }),
        style: new Style({
            fill: new Fill({
                color: 'rgba(0, 255, 255, .1)', 
            }),
            stroke: new Stroke({
                color: '#c99ef5', 
                width: 4, 
            }),
        })
    })
}

export function newDrawFeatureLayer(): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: new Array<Feature>()
        }),
        style: new Style({
            fill: new Fill({
                color: '#9777b850', 
            }),
            stroke: new Stroke({
                color: '#9dff4d', 
                width: 4, 
            }),
        })
    })
}

export function highlightFeature(layer: VectorLayer, gejsonStr: string) {
    const source = layer.getSource()
    if (!source) {
        throw new Error('Layer source cannot be null.');
    }
    source.clear()
    const geometry = new GeoJSON().readGeometry(gejsonStr);
    const feature = new Feature(geometry);
    source?.addFeature(feature)
}

export function newBaseDraw(layer: VectorLayer, createFinderGeoJson: Writable<string>): Draw {
    const source = layer.getSource()
    if (!source) {
        throw new Error('Layer source cannot be null.');
    }
    source.clear()
    const draw = new Draw({
        source: source,
        type: 'Point',
      });
    draw.on('drawend', function (event) {
        // Clear the previous point if it exists
        source?.clear()  
        
        // Get the coordinates of the drawn point
        
        const extent  = event.feature.getGeometry()?.getExtent()
        if (!extent) {
            throw new Error('Extent cannot be null.');
        }
        const degreeSize = 1 
        const squarePolygon = new Polygon([
            [
                [extent[0] - degreeSize, extent[1] - degreeSize], // bottom left
                [extent[0] + degreeSize, extent[1] - degreeSize], // bottom right
                [extent[0] + degreeSize, extent[1] + degreeSize], // top right
                [extent[0] - degreeSize, extent[1] + degreeSize], // top left
                [extent[0] - degreeSize, extent[1] - degreeSize]  // closing the square
              ]
        ]);
        const feature = new Feature(squarePolygon);
        source?.addFeature(feature)
        const geojsonFormatter = new GeoJSON();
        createFinderGeoJson.set(geojsonFormatter.writeGeometry(squarePolygon))
      });
      
      return draw
}

export function newBaseModify(layer: VectorLayer, createFinderGeoJson: Writable<string>): Modify {
    const source = layer.getSource()
    if (!source) {
        throw new Error('Layer source cannot be null.');
    }
    const modify = new Modify({
        source: source,
    });
    modify.on('modifyend', function (event) {
        const modifiedFeatures = event.features;
        modifiedFeatures.forEach((feature: Feature) => {
            const geojsonFormatter = new GeoJSON();
            const geometry = feature.getGeometry() 
            if (!geometry) {
                throw new Error('geometry cannot be null.');
            }
            createFinderGeoJson.set(geojsonFormatter.writeGeometry(geometry))
        });
    });
    
    return modify
}