import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

/**
 * Makes a request to the Augur API and returns the data directly
 * @param endpoint - The Augur API endpoint (e.g., "/api/core/location")
 * @param options - Standard fetch options
 * @returns JSON response with data directly or error object
 */
export async function augurFetch(endpoint: string, options?: RequestInit) {
	if (!env.LUNA_AUGUR_HOST) {
		console.error("[augur] LUNA_AUGUR_HOST environment variable is not set");
		return json(
			{ error: "Server configuration error: LUNA_AUGUR_HOST not configured" },
			{ status: 500 }
		);
	}

	const url = `${env.LUNA_AUGUR_HOST}${endpoint}`;

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			console.error(`[augur] ${endpoint} error`, response.status, errorBody);
			return json(
				{
					error: `Upstream responded with ${response.status}`,
					details: errorBody?.slice(0, 500),
				},
				{ status: 502 }
			);
		}

		const data = await response.json();
		// Return data directly without wrapping
		return json(data);
	} catch (error) {
		console.error(`[augur] ${endpoint} request failed`, error);
		return json(
			{ error: "Unable to reach Augur backend." },
			{ status: 502 }
		);
	}
}

