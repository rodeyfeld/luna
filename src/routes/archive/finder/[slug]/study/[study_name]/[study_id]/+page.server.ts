import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
	const parentData = await parent();
	
	try {
		const response = await fetch(`/api/study/${params.study_name}/${params.study_id}/results`);
		
		if (!response.ok) {
			console.error('[study detail] Failed to fetch results:', response.statusText);
			return {
				finderData: parentData.finderData,
				studyResults: null,
				error: `Failed to load study results: ${response.statusText}`,
			};
		}
		
		const data = await response.json();
		
		return {
			finderData: parentData.finderData,
			studyResults: data?.error ? null : data,
			studyName: params.study_name,
			studyId: params.study_id,
			error: null,
		};
	} catch (err) {
		console.error('[study detail] Error fetching results:', err);
		return {
			finderData: parentData.finderData,
			studyResults: null,
			error: err instanceof Error ? err.message : 'Failed to load study results',
		};
	}
};

