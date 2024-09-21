import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	
	let response = await fetch(`/api/feasibility_finder/finder_results/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	let data = await response.json();
	
	let finder_results = data.results;

    response = await fetch(`/api/feasibility_finder/finder_data/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	data = await response.json();
	
	let finder_data = data.results;
    console.log(finder_data)

	return {
		finder_results: finder_results,
		finder_data: finder_data,
	}
};