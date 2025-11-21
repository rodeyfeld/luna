import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { StoredGeometry } from "$lib/types/imagery";

interface ImageryResponse extends StoredGeometry {
	error?: string;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
  const geometryId = params.pk;

  if (!geometryId) {
    throw error(400, "Missing geometry identifier.");
  }

	try {
		// Fetch the geometry
		const response = await fetch(`/api/imagery/${encodeURIComponent(String(geometryId))}`);
		const payload = (await response.json().catch(() => ({}))) as ImageryResponse;

		if (!response.ok) {
    return {
      geometry: null,
			finders: [],
				error: payload?.error ?? "Unable to load the requested area of interest.",
    };
  }

		const match = (payload?.error ? null : payload) as StoredGeometry | null;

  if (!match) {
    return {
      geometry: null,
			finders: [],
      error: "Area of interest not found.",
    };
  }

		// Fetch all imagery finders and filter for this location
		let finders: any[] = [];
		try {
			const findersResponse = await fetch('/api/archive');
			if (findersResponse.ok) {
				const allFinders = await findersResponse.json();
				// Filter finders that use this location_id
				finders = Array.isArray(allFinders) 
					? allFinders.filter((f: any) => f.location?.id === match.id)
					: [];
			}
		} catch (err) {
			console.error("[areas-of-interest/:pk] failed to load finders", err);
		}

  return {
    geometry: match,
		finders: finders,
    error: null,
  };
	} catch (err) {
		console.error("[areas-of-interest/:pk] failed to load geometry", err);
		return {
			geometry: null,
			finders: [],
			error: "Unable to connect to the area of interest service.",
		};
	}
};

