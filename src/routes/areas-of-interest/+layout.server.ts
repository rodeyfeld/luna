import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/imagery');
	const images = await response.json();
	return {
		images: Array.isArray(images) ? images : []
	}
};