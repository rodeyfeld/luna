import type { Actions, PageServerLoad } from './$types';

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

	return {
		finder_results: finder_results,
		finder_data: finder_data,
	}
};


export const actions = {

	execute: async ({ request, fetch }) => {
		const formData = await request.formData();
		const finderExecuteData = {
				'feasibility_finder_id': formData.get("feasibility_finder_id"),
		};

		const response = await fetch('/api/feasibility_finder/finder_execute', {
			method: 'POST',
			body: JSON.stringify(finderExecuteData),
			headers: {
				'content-type': 'application/json',
			},
		});
		return {
			success: true
		}

	},

} satisfies Actions;