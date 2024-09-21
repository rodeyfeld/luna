import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/imagery', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await response.json();
	const { images = [] } = await data;
	return {
		images: images
	}
};