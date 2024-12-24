<script>
	import { run } from 'svelte/legacy';

	import { onMount } from "svelte";

	
	/**
	 * @typedef {Object} Props
	 * @property {{ status: string; study_name: string; id: any; }} data
	 */

	/** @type {Props} */
	let { data } = $props();
	let status;
	run(() => {
		status = data.status;
	});

	async function pollStatus() {
		const response = await fetch(
			`/api/study/status/${data.study_name}/${data.id}`,
			{
				method: "GET",
				headers: {
					"content-type": "application/json",
				},
			},
		);
		console.log(data);
		const rdata = await response.json();
		status = rdata.results.status;
	}

	onMount(() => {
		const interval = setInterval(() => {
			pollStatus();
		}, 10000);

		return () => clearInterval(interval);
	});
</script>

{status}
