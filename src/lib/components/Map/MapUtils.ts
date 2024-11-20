import { Fill, Stroke, Style} from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import TileLayer from 'ol/layer/Tile.js';
import { View } from 'ol';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import { Feature } from 'ol';
import { Draw } from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';


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

export function baseFeatureLayer(features: Array<Feature>): VectorLayer {
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
                color: '#9dff4d', 
                width: 4, 
            }),
        })
    })
}

export function highlightFeature(layer: VectorLayer, gejsonStr: string) {
    const source = layer.getSource()
    source?.clear()
    const geometry = new GeoJSON().readGeometry(gejsonStr);
    const feature = new Feature(geometry);
    source?.addFeature(feature)
}