import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
	let response = await fetch('/api/imagery', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	let data = await response.json();
	const { images = [] } = await data;

	response = await fetch('/api/archive', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	data = await response.json();
	const { finders = [] } = await data;

	
	return {
		finders: finders,
		images: images
	}
};