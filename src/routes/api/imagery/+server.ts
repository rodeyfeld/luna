import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[api/imagery] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}
	
	const url = `${env.LUNA_AUGUR_HOST}/api/core/location/`;

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

		return json({ results: data });
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
