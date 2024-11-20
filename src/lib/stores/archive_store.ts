import { writable } from 'svelte/store';

export default writable({});
export const createFinderGeoJson = writable<string>();
export const selectedFinderGeoJson= writable<string>();
export const finderMode = writable<string>();
export const sidebarMode = writable<string>();
export const selectedArchiveResultGeoJson = writable<string>();
export const selectedArchiveResultThumbnail = writable<string>();
