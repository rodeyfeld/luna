import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async ({ params, fetch }) => {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[api/imagery/slug] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}
	
	const geometryId = params.slug;

	if (!geometryId) {
		return json(
			{ error: "Missing geometry identifier." },
			{ status: 400 }
		);
	}

	const url = `${env.LUNA_AUGUR_HOST}/api/core/location/id/${encodeURIComponent(geometryId)}/`;

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
	return json({ result: data });
	} catch (error) {
		console.error("[api/imagery/:slug] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
