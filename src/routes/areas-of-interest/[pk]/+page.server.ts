import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { StoredGeometry } from "$lib/types/imagery";

interface ImageryResponse {
	image?: StoredGeometry | null;
	error?: string;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const geometryId = params.pk;

	if (!geometryId) {
		throw error(400, "Missing geometry identifier.");
	}

	try {
		const response = await fetch(`/api/imagery/${encodeURIComponent(String(geometryId))}`);
		const payload = (await response.json().catch(() => ({}))) as ImageryResponse;

		if (!response.ok) {
			return {
				geometry: null,
				error: payload?.error ?? "Unable to load the requested area of interest.",
			};
		}

		const match = (payload?.image ?? null) as StoredGeometry | null;

		if (!match) {
			return {
				geometry: null,
				error: "Area of interest not found.",
			};
		}

		return {
			geometry: match,
			error: null,
		};
	} catch (err) {
		console.error("[areas-of-interest/:pk] failed to load geometry", err);
		return {
			geometry: null,
			error: "Unable to connect to the area of interest service.",
		};
	}
};

