import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

const FALLBACK_HOST = "http://localhost:8000";

export const GET: RequestHandler = async ({ params }) => {
	const host = env.LUNA_AUGUR_HOST ?? FALLBACK_HOST;
	const url = `${host}/api/imagery/finder/id/${params.slug}`;

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
	return json({ results: data });
	} catch (error) {
		console.error("[api/archive/finder_data] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
