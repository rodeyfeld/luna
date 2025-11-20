import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {

	// const request_data = await request.json()
	const url = `${env.LUNA_AUGUR_HOST}/api/core/location`;
	const response = await fetch(url);
	const data = await response.json();
	return json({ images: data });
};
