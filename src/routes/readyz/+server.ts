import { type RequestHandler } from "@sveltejs/kit";

// Readiness for k8s and kami: the server is up and routing. It doesn't check augur, so an
// augur outage doesn't take luna out of the Service too.
export const GET: RequestHandler = () => {
	return new Response("ok", { headers: { "cache-control": "no-store" } });
};
