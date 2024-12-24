import { env } from "$env/dynamic/private";
import { json, type RequestHandler } from "@sveltejs/kit";



export const POST: RequestHandler = async ({ request }) => {
	const requestData = await request.json()
	const url = `${env.LUNA_AUGUR_HOST}/api/archive/finder/create`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(requestData),
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await response.json();
	return json({ finder: data });
};
