import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

// Note: This route expects params like /api/study/imagery_finder/{study_id}/results
// The study_name is hardcoded as "imagery_finder" in the URL path
export const GET: RequestHandler = async ({ params }) => {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[api/study/results] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}
	
	const url = `${env.LUNA_AUGUR_HOST}/api/imagery/study/imagery_finder/${params.slug}/results/`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			console.error("[api/study/results] upstream error", response.status, errorBody);
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
		console.error("[api/study/results] request failed", error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
};
