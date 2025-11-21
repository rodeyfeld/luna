import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/archive/finder_data/${params.slug}`);
	const data = await response.json();
	
	return {
		finderId: params.slug,
		finderData: data.result || null,
	};
};
