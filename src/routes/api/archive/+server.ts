import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {

	// const request_data = await request.json()
  	const url = "http://localhost:8000/api/archive/finder";
	const response = await fetch(url);
	const data = await response.json();
	return json({finders: data});
};
