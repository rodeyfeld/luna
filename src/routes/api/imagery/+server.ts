import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

const FALLBACK_HOST = "http://localhost:8000";

export const POST: RequestHandler = async () => {
	const host = env.LUNA_AUGUR_HOST ?? FALLBACK_HOST;
	const url = `${host}/api/core/location`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			const errorBody = await response.text();
			console.error("[api/imagery] upstream error", response.status, errorBody);
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: errorBody?.slice(0, 500),
				},
				{ status: 502 }
			);
		}

		let data: unknown;
		try {
			data = await response.json();
		} catch (parseError) {
			console.error("[api/imagery] failed to parse JSON", parseError);
			return json(
				{
					error: "Unable to parse upstream response as JSON.",
				},
				{ status: 502 }
			);
		}

		return json({ images: data });
	} catch (error) {
		console.error("[api/imagery] request failed", error);
		return json(
			{
				error: "Unable to reach Augur backend.",
			},
			{ status: 502 }
		);
	}
};
