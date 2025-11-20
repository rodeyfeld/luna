import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const FALLBACK_HOST = "http://localhost:8000";

export const POST: RequestHandler = async () => {
	const host = env.LUNA_AUGUR_HOST ?? FALLBACK_HOST;
	const url = `${host}/api/imagery/finder`;

	try {
	const response = await fetch(url);

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			console.error("[api/archive] upstream error", response.status, errorBody);
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: errorBody?.slice(0, 500),
				},
				{ status: 502 }
			);
		}

	const data = await response.json();
	return json({ finders: data });
	} catch (error) {
		console.error("[api/archive] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
