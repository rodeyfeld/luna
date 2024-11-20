import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {

    let response = await fetch(`/api/study/imagery_finder/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	let data = await response.json();
	let studyResults = data.results;
	return {
		studyResults: studyResults,
	}
};
