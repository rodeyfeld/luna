import { env } from '$env/dynamic/public';
import 'ol/ol.css';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import type BaseLayer from 'ol/layer/Base.js';
import { applyStyle } from 'ol-mapbox-style';
import { layers, namedFlavor, type Flavor } from '@protomaps/basemaps';

/*
 * Luna's basemap: Protomaps vector tiles drawn with the dark flavor, retinted
 * to the app palette so the map reads as part of the page instead of a
 * picture dropped into it. Land sits one step above the night background,
 * water sinks below it, and labels stay quiet.
 *
 * Needs PUBLIC_PROTOMAPS_KEY (https://protomaps.com/account). Without it we
 * fall back to CARTO's keyless dark raster so the map never goes bright.
 */

const ATTRIBUTION =
	'<a href="https://protomaps.com" target="_blank" rel="noreferrer">Protomaps</a> · ' +
	'<a href="https://openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

const dark = namedFlavor('dark');

const lunaFlavor: Flavor = {
	...dark,
	background: '#0b0e13',
	earth: '#12161d',
	water: '#07090d',
	glacier: '#161a22',
	sand: '#14181f',
	beach: '#14181f',
	park_a: '#121a18',
	park_b: '#131c19',
	wood_a: '#121917',
	wood_b: '#121917',
	scrub_a: '#13181a',
	scrub_b: '#13181a',
	buildings: '#0d1016',
	boundaries: '#3a4150',
	ocean_label: '#3e4553',
	country_label: '#6f7581',
	state_label: '#3e4553',
	state_label_halo: '#07090d',
	city_label: '#8d929c',
	city_label_halo: '#07090d',
	subplace_label: '#565c68',
	subplace_label_halo: '#07090d',
	roads_label_minor_halo: '#07090d',
	roads_label_major_halo: '#07090d',
	landcover: {
		grassland: '#131917',
		barren: '#15171b',
		urban_area: '#151820',
		farmland: '#141917',
		glacier: '#171b22',
		scrub: '#141818',
		forest: '#121a17'
	}
};

function protomapsStyle(key: string) {
	return {
		version: 8,
		glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
		sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/dark',
		sources: {
			protomaps: {
				type: 'vector',
				tiles: [`https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt?key=${key}`],
				maxzoom: 15,
				attribution: ATTRIBUTION
			}
		},
		// Points of interest are noise at the scales we search at
		layers: layers('protomaps', lunaFlavor, { lang: 'en' }).filter((l) => !l.id.startsWith('pois'))
	};
}

function fallbackLayer(): BaseLayer {
	return new TileLayer({
		className: 'luna-basemap',
		source: new XYZ({
			url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
			attributions:
				'© <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a> · ' +
				'<a href="https://openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
			crossOrigin: 'anonymous'
		})
	});
}

/**
 * A fresh basemap layer. Each OpenLayers map needs its own instance.
 * Pass `labels: false` for thumbnails, where place names are just clutter.
 */
export function lunaBasemap(options: { labels?: boolean } = {}): BaseLayer {
	const key = env.PUBLIC_PROTOMAPS_KEY;
	if (!key) return fallbackLayer();

	const style = protomapsStyle(key);
	if (options.labels === false) {
		style.layers = style.layers.filter((l) => l.type !== 'symbol');
	}

	const layer = new VectorTileLayer({
		className: 'luna-basemap',
		declutter: true,
		background: lunaFlavor.water
	});
	applyStyle(layer, style).catch((err) => console.error('Basemap style failed to apply', err));
	return layer;
}
