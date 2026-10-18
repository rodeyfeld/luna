import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// event.locals.user = await getUserInformation(event.cookies.get('sessionid'));

	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('x-frame-options', 'SAMEORIGIN');
	response.headers.set('strict-transport-security', 'max-age=31536000');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');

	return response;
};