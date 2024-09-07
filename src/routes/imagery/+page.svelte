<h1>My Images</h1>

<script lang="ts">

	let msg = 'test';
	
	async function add() {
		const response = await fetch('/api/imagery', {
			method: 'POST',
			body: JSON.stringify({ msg }),
			headers: {
				'content-type': 'application/json',
			},
		});
	
		msg = await response.json();
	}
</script>

{msg}
<br />
<button on:click={add}>run</button>