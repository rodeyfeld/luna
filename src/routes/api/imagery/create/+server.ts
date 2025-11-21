import { type RequestHandler } from "@sveltejs/kit";
import { augurFetch } from "$lib/server/augur";

export const POST: RequestHandler = async ({ fetch, request }) => {
	const requestData = await request.json();
	return augurFetch(fetch, "/api/core/location/create", {
		method: "POST",
		body: JSON.stringify(requestData),
		headers: {
			"content-type": "application/json",
		},
	});
};
