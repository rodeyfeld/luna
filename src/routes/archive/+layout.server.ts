import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	// Fetch imagery (areas of interest)
	let response = await fetch('/api/imagery');
	let data = await response.json();
	const { results: images = [] } = data;

	// Fetch archive finders
	response = await fetch('/api/archive');
	data = await response.json();
	const { results: finders = [] } = data;

	return {
		finders: finders,
		images: images
	}
};