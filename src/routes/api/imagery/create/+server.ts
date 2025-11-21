import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[api/imagery/create] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}
	
	const requestData = await request.json();
	const url = `${env.LUNA_AUGUR_HOST}/api/core/location/create`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(requestData),
			headers: {
				'content-type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			console.error("[api/imagery/create] upstream error", response.status, errorBody);
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
		console.error("[api/imagery/create] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
