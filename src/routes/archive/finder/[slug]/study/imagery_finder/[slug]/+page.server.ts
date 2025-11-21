import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {

	const response = await fetch(`/api/study/imagery_finder/${params.slug}/results`);
	const study = await response.json();
	return {
		study: study?.error ? null : study,
	}
};
