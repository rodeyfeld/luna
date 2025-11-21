import { Fill, Stroke, Style } from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile.js';
import { View } from 'ol';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Draw, Modify } from 'ol/interaction.js';
import { Polygon } from 'ol/geom';
import type { Writable } from 'svelte/store';
import Collection from 'ol/Collection'

/**
 * Create a simple map with a single geometry and auto-zoom to it
 * @param htmlTarget - The HTML element ID to render the map
 * @param geometry - GeoJSON geometry object
 * @param options - Optional configuration
 */
export function createSimpleGeometryMap(
    htmlTarget: string | HTMLElement,
    geometry: any,
    options?: {
        fillColor?: string;
        strokeColor?: string;
        strokeWidth?: number;
        padding?: number[];
        duration?: number;
    }
): Map {
    const vectorSource = new VectorSource();
    const geoJSON = new GeoJSON();

    // Parse and add geometry
    if (geometry) {
        try {
            const feature = geoJSON.readFeature(geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:4326',
            });

            feature.setStyle(new Style({
                fill: new Fill({
                    color: options?.fillColor || 'rgba(59, 130, 246, 0.2)',
                }),
                stroke: new Stroke({
                    color: options?.strokeColor || 'rgba(59, 130, 246, 1)',
                    width: options?.strokeWidth || 2,
                }),
            }));

            vectorSource.addFeature(feature);
        } catch (error) {
            console.error('Failed to parse geometry:', error);
        }
    }

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    const map = new Map({
        target: htmlTarget,
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer,
        ],
        view: new View({
            center: [0, 0],
            zoom: 2,
            projection: 'EPSG:4326',
        }),
    });

    // Auto-zoom to geometry extent after map is fully sized
    setTimeout(() => {
        if (vectorSource.getFeatures().length > 0) {
            map.updateSize(); // Ensure map knows its container size
            const extent = vectorSource.getExtent();
            map.getView().fit(extent, {
                padding: options?.padding || [60, 60, 60, 60],
                duration: options?.duration || 500,
            });
        }
    }, 150);

    return map;
}
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


export function newFilterFeatureLayer(): VectorLayer {
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


export function newFilterDraw(layer: VectorLayer, featureStore: Writable<Array<Feature>>): Draw {
    const source = layer.getSource()
    if (!source) {
        throw new Error('Layer source cannot be null.');
    }
    const draw = new Draw({
        source: source,
        type: 'Point',
    });
    draw.on('drawend', function(event) {

        const filterGeometry = event.feature.getGeometry()
        const geojsonFormatter = new GeoJSON();
        const filterFeatures = source.getFeatures().filter((feature: Feature) => {
            if (!feature) {
                throw new Error('feature cannot be null.');
            }
            const geometry = feature.getGeometry()
            if (!geometry) {
                throw new Error('feature cannot be null.');
            }

            if (!filterGeometry) {
                throw new Error('geometry cannot be null.');
            }

            return geometry.intersectsCoordinate(filterGeometry.getExtent())
        })
        featureStore.set(filterFeatures)
    });

    return draw
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
    draw.on('drawend', function(event) {
        // Clear the previous point if it exists
        source?.clear()

        // Get the coordinates of the drawn point

        const extent = event.feature.getGeometry()?.getExtent()
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
    modify.on('modifyend', function(event) {
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
