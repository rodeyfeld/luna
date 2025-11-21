import { type RequestHandler } from "@sveltejs/kit";
import { augurFetch } from "$lib/server/augur";

export const GET: RequestHandler = async ({ fetch }) => {
	return augurFetch(fetch, "/api/providers/");
};
