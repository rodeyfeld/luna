import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {
  	const url = `http://localhost:8000/api/archive/study/imagery_finder/${params.slug}/results`;
	const response = await fetch(url);
	const data = await response.json();
	return json({results: data});
};
