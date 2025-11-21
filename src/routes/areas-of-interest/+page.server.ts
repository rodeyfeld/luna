import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/imagery');
	const images = await response.json();
	return {
		images: Array.isArray(images) ? images : []
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