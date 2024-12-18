import { json, type RequestHandler } from "@sveltejs/kit";



export const POST: RequestHandler = async ({ request }) => {
	const requestData = await request.json()
  	const url = "http://localhost:8000/api/archive/study/execute";

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(requestData),
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await response.json();
	return json({status: data});
};
