import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

/**
 * Makes a request to the Augur API and returns the data directly
 * @param fetch - SvelteKit fetch function
 * @param endpoint - The Augur API endpoint (e.g., "/api/core/location")
 * @param options - Standard fetch options
 * @returns JSON response with data directly or error object
 */
export async function augurFetch(
	fetch: typeof globalThis.fetch,
	endpoint: string,
	options?: RequestInit
) {
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
			// Log full error server-side for debugging
			console.error(`[augur] ${endpoint} error ${response.status}:`, errorBody.slice(0, 200));
			// Return minimal error info to client
			return json(
				{ error: `Request failed with status ${response.status}` },
				{ status: 502 }
			);
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error(`[augur] ${endpoint} request failed:`, error instanceof Error ? error.message : String(error));
		return json(
			{ error: "Unable to reach backend service" },
			{ status: 502 }
		);
	}
}

