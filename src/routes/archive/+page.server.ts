import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/archive');
	const data = await response.json();
	const { results = [] } = data;

	return {
		finders: results
	}
};
