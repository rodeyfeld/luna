import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {
	const url = `http://localhost:8000/api/archive/study/${params.study_name}/${params.slug}/status`;
	const response = await fetch(url);
	const data = await response.json();
	return json({ results: data });
};
