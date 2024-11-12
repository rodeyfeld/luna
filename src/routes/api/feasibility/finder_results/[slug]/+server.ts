import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {
  	const url = `http://localhost:8000/api/feasibility/results/id/finder/${params.slug}`;
	const response = await fetch(url);
	const data = await response.json();
	return json({results: data});
};
