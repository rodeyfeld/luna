export type GeoJSONGeometry =
	| {
			type: 'Point';
			coordinates: [number, number];
	  }
	| {
			type: 'Polygon';
			coordinates: number[][][];
	  }
	| {
			type: 'MultiPolygon';
			coordinates: number[][][][];
	  }
	| {
			type: string;
			coordinates?: any;
			geometry?: GeoJSONGeometry;
			features?: Array<{ geometry: GeoJSONGeometry }>;
	  };

const DEFAULT_POINT_SIZE = 0.25; // degrees

export function normalizeGeometry(
	geometry: GeoJSONGeometry | null | undefined,
	pointSize = DEFAULT_POINT_SIZE
): GeoJSONGeometry | null {
	if (!geometry) return null;

	// FeatureCollection or Feature wrappers
	if ('features' in geometry && geometry.features?.length) {
		return normalizeGeometry(geometry.features[0]?.geometry, pointSize);
	}

	if ('geometry' in geometry && geometry.geometry) {
		return normalizeGeometry(geometry.geometry, pointSize);
	}

	if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
		const [lon, lat] = geometry.coordinates;
		return pointToPolygon([lon, lat], pointSize);
	}

	if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
		return geometry;
	}

	// Unsupported type falls back to original geometry
	return geometry;
}

function pointToPolygon([lon, lat]: [number, number], size: number): GeoJSONGeometry {
	const ring = [
		[lon - size, lat - size],
		[lon + size, lat - size],
		[lon + size, lat + size],
		[lon - size, lat + size]
	];
	// close the ring by repeating the first coordinate
	ring.push(ring[0]);
	return {
		type: 'Polygon',
		coordinates: [ring]
	};
}

