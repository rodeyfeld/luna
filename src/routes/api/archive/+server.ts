import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
export const POST: RequestHandler = async ({ request }) => {
	// const request_data = await request.json()
	console.log(`luna host: ${env.LUNA_AUGUR_HOST}`)
	const url = `${env.LUNA_AUGUR_HOST}/api/archive/finder`;
	const response = await fetch(url);
	const data = await response.json();
	return json({ finders: data });
};
