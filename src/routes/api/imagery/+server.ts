import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {

  const url = "http://localhost:8000/api/providers";
	const response = await fetch(url);
	const data = await response.json();
	return new Response(JSON.stringify(data));
};


