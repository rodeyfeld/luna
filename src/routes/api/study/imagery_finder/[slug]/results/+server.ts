import { type RequestHandler } from "@sveltejs/kit";
import { augurFetch } from "$lib/server/augur";

export const GET: RequestHandler = async ({ fetch, params }) => {
	return augurFetch(fetch, `/api/imagery/study/imagery_finder/${params.slug}/results/`);
};
