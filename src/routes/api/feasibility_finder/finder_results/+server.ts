import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {

	// const request_data = await request.json()
  	const url = "http://localhost:8000/api/feasibility/results";
	const response = await fetch(url);
	const data = await response.json();
	return json({results: data});
};
 