import { Fill, Stroke, Style } from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import { View } from 'ol';
import Map from 'ol/Map.js';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Draw, Modify } from 'ol/interaction.js';
import { Polygon } from 'ol/geom';
import { useGeographic } from 'ol/proj.js';
import type { Writable } from 'svelte/store';
import Collection from 'ol/Collection'
import { lunaBasemap } from './basemap';

// Vector basemap tiles only come in Web Mercator. Rather than reproject every
// geometry by hand, tell OpenLayers that all coordinates we pass in or read back
// (features, view centers, extents, drawn shapes) are lon/lat. The view itself
// renders in EPSG:3857.
useGeographic();

/** Overlay colors, matched to the app's flat palette in app.css */
export const mapColors = {
    moon: '#ebe6d9',
    dust: '#a7abb5',
    sodium: '#e8a54b',
    tide: '#86a9cc',
    sage: '#93bf9f',
    night: '#07090d',
};

export function alpha(hex: string, a: number): string {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Saved area / finder footprint */
export const areaStyle = new Style({
    fill: new Fill({ color: alpha(mapColors.moon, 0.06) }),
    stroke: new Stroke({ color: alpha(mapColors.moon, 0.85), width: 1.5 }),
});

/** Selected or hovered feature */
export const highlightStyle = new Style({
    fill: new Fill({ color: alpha(mapColors.sodium, 0.14) }),
    stroke: new Stroke({ color: mapColors.sodium, width: 2.5 }),
});

/** Shape being drawn by the user */
export const drawStyle = new Style({
    fill: new Fill({ color: alpha(mapColors.sodium, 0.1) }),
    stroke: new Stroke({ color: mapColors.sodium, width: 2, lineDash: [6, 4] }),
});

/** Imagery result footprints */
export const footprintStyle = new Style({
    fill: new Fill({ color: alpha(mapColors.tide, 0.03) }),
    stroke: new Stroke({ color: alpha(mapColors.tide, 0.55), width: 0.75 }),
});

/** The search area a study ran against */
export const searchAreaStyle = new Style({
    fill: new Fill({ color: alpha(mapColors.moon, 0.04) }),
    stroke: new Stroke({ color: alpha(mapColors.moon, 0.9), width: 1.5, lineDash: [8, 5] }),
});

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
        labels?: boolean;
    }
): Map {
    const vectorSource = new VectorSource();
    const geoJSON = new GeoJSON();

    // Parse and add geometry
    if (geometry) {
        try {
            const feature = geoJSON.readFeature(geometry) as Feature;

            feature.setStyle(new Style({
                fill: new Fill({
                    color: options?.fillColor || alpha(mapColors.moon, 0.06),
                }),
                stroke: new Stroke({
                    color: options?.strokeColor || alpha(mapColors.moon, 0.85),
                    width: options?.strokeWidth || 1.5,
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
            lunaBasemap({ labels: options?.labels }),
            vectorLayer,
        ],
        view: new View({
            center: [0, 20],
            zoom: 2,
        }),
    });

    // Auto-zoom to geometry extent after map is fully sized
    setTimeout(() => {
        if (vectorSource.getFeatures().length > 0) {
            map.updateSize(); // Ensure map knows its container size
            const extent = vectorSource.getExtent();
            map.getView().fit(extent, {
                padding: options?.padding || [60, 60, 60, 60],
                duration: options?.duration ?? 500,
            });
        }
    }, 150);

    return map;
}
export function lunaMap(htmlTarget: string): Map {
    return new Map({
        view: new View({
            center: [0, 20],
            zoom: 2,
        }),
        layers: [lunaBasemap()],
        target: htmlTarget,
    });
}

export function lunaLockedMap(htmlTarget: string): Map {
    return new Map({
        view: new View({
            center: [0, 20],
            zoom: 2,
        }),
        layers: [lunaBasemap()],
        target: htmlTarget,
        interactions: new Collection()
    });
}

export function newBaseFeatureLayer(features: Array<Feature>): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: features
        }),
        style: areaStyle
    })
}




export function newHighlightFeatureLayer(): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: new Array<Feature>()
        }),
        style: highlightStyle
    })
}

export function newDrawFeatureLayer(): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: new Array<Feature>()
        }),
        style: drawStyle
    })
}


export function newFilterFeatureLayer(): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            features: new Array<Feature>()
        }),
        style: drawStyle
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
        style: drawStyle,
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
        style: drawStyle,
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
