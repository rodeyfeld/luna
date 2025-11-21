import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/imagery');
	const data = await response.json();
	const { results = [] } = data;
	return {
		images: results
	}
};