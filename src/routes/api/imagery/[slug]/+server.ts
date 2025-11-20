import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {

	// const request_data = await request.json()
	const url = `${env.LUNA_AUGUR_HOST}/api/core/location/id/${params.slug}`;
	const response = await fetch(url);
	const data = await response.json();
	return json({ image: data });
};
