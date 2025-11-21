import { json, type RequestHandler } from "@sveltejs/kit";
import { augurFetch } from "$lib/server/augur";

export const GET: RequestHandler = async ({ params }) => {
	const geometryId = params.slug;

	if (!geometryId) {
		return json(
			{ error: "Missing geometry identifier." },
			{ status: 400 }
		);
	}

	return augurFetch(`/api/core/location/id/${encodeURIComponent(geometryId)}`);
};
