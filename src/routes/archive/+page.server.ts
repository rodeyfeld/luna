import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/archive', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await response.json();
	const { finders = [] } = await data;

	return {
		finders: finders
	}
};
