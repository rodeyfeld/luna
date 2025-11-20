import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// Custom localStorage store implementation (replaced from Skeleton v2)
function createLocalStorageStore<T>(key: string, initialValue: T): Writable<T> {
	const storedValue = browser ? localStorage.getItem(key) : null;
	const data = storedValue ? JSON.parse(storedValue) : initialValue;
	
	const store = writable<T>(data);
	
	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});
	}
	
	return store;
}

// Svelte Writable Stores ---

// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'cerberus');

// Local Storage Stores ---

// Persists the tab selection for the user's preferred onboarding method
export const storeOnboardMethod: Writable<string> = createLocalStorageStore('storeOnboardMethod', 'cli');