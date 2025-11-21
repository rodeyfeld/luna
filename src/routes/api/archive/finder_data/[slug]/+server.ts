import { type RequestHandler } from "@sveltejs/kit";
import { augurFetch } from "$lib/server/augur";

export const GET: RequestHandler = async ({ params }) => {
	return augurFetch(`/api/imagery/finder/id/${params.slug}`);
};
