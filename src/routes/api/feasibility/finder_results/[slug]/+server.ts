import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {

	// const request_data = await request.json()
    console.log("Here")
  	const url = `http://localhost:8000/api/feasibility/results/id${params.slug}`;
	const response = await fetch(url);
	const data = await response.json();
	return json({results: data});
};
