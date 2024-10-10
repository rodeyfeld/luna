import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, fetch }) => {
    const response = await fetch(`/api/archive_finder/finder_data/${params.slug}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	});
	const data = await response.json();
	let finderData = data.results;
	return {
		finderData: finderData,
	}
};
