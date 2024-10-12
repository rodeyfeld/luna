import { writable } from 'svelte/store';

export default writable({});
export const geoJsonStore = writable<string>();
export const finderMode = writable<string>();
export const sidebarMode = writable<string>();
