import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
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

export const actions = {
	submit: async ({ request, fetch }) => {
		const formData = await request.formData();
		const imageryCreateData = {
				'name': formData.get('imageryName'),
			 	'geometry': formData.get('imageryGEOJSON')
		};

		const response = await fetch('/api/imagery/create', {
			method: 'POST',
			body: JSON.stringify(imageryCreateData),
			headers: {
				'content-type': 'application/json',
			},
		});
		return {
			success: true
		}
	},
} satisfies Actions;