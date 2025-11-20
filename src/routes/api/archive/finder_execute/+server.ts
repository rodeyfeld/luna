import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

const FALLBACK_HOST = "http://localhost:8000";

export const POST: RequestHandler = async ({ request }) => {
	const host = env.LUNA_AUGUR_HOST ?? FALLBACK_HOST;
	const requestData = await request.json();
	const url = `${host}/api/imagery/study/execute`;

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
			console.error("[api/archive/finder_execute] upstream error", response.status, errorBody);
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: errorBody?.slice(0, 500),
				},
				{ status: 502 }
			);
		}

	const data = await response.json();
	return json({ status: data });
	} catch (error) {
		console.error("[api/archive/finder_execute] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
