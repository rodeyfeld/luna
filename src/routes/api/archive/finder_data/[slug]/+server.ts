import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[api/archive/finder_data] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}
	
	const url = `${env.LUNA_AUGUR_HOST}/api/imagery/finder/id/${params.slug}/`;

	try {
	const response = await fetch(url);

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			console.error("[api/archive/finder_data] upstream error", response.status, errorBody);
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: errorBody?.slice(0, 500),
				},
				{ status: 502 }
			);
		}

	const data = await response.json();
	return json({ result: data });
	} catch (error) {
		console.error("[api/archive/finder_data] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
