import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	// Fetch imagery (areas of interest)
	const imagesResponse = await fetch('/api/imagery');
	const images = await imagesResponse.json();

	// Fetch archive finders
	const findersResponse = await fetch('/api/archive');
	const finders = await findersResponse.json();

	return {
		finders: Array.isArray(finders) ? finders : [],
		images: Array.isArray(images) ? images : []
	}
};