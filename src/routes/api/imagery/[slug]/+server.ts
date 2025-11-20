import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const FALLBACK_HOST = "http://localhost:8000";

export const GET: RequestHandler = async ({ params, fetch }) => {
	const host = env.LUNA_AUGUR_HOST ?? FALLBACK_HOST;
	const geometryId = params.slug;

	if (!geometryId) {
		return json(
			{ error: "Missing geometry identifier." },
			{ status: 400 }
		);
	}

	const url = `${host}/api/core/location/id/${encodeURIComponent(geometryId)}`;

	try {
	const response = await fetch(url);

		if (!response.ok) {
			const details = await response.text().catch(() => "");
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: details?.slice(0, 500) ?? null,
				},
				{ status: 502 }
			);
		}

	const data = await response.json();
	return json({ image: data });
	} catch (error) {
		console.error("[api/imagery/:slug] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
