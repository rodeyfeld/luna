import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	
	let response = await fetch(`/api/archive_finder/finder_results/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	let data = await response.json();
	
	let finderResults = data.results;

    response = await fetch(`/api/archive_finder/finder_data/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	data = await response.json();
	let finderData = data.results;
	return {
		finderResults: finderResults,
		finderData: finderData,
	}
};


export const actions = {

	execute: async ({ request, fetch }) => {
		const formData = await request.formData();
		const finderExecuteData = {
				'archive_finder_id': formData.get("archive_finder_id"),
		};

		const response = await fetch('/api/archive_finder/finder_execute', {
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