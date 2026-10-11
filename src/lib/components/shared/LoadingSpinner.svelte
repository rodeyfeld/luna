<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		message?: string;
	}

	let { size = 'md', message }: Props = $props();

	const px = $derived({ sm: 28, md: 44, lg: 64 }[size]);
</script>

<div class="flex flex-col items-center justify-center gap-4 py-10" role="status">
	<img src="/pinwheel.svg" alt="" width={px} height={px} class="spinner opacity-80" />
	<p class="eyebrow">{message ?? 'Loading'}</p>
</div>

<style>
	.spinner {
		animation: rotate-moon 2.4s linear infinite;
	}
</style>
