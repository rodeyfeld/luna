<script>
	import { onMount } from "svelte";

	/**
	 * @type {{ status: string; study_name: string; id: any; }}
	 */
	export let data;
	$: status = data.status;

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
