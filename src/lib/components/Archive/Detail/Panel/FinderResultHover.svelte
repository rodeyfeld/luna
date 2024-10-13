<script lang="ts">
	import { page } from '$app/stores';
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	const popupFocusClick: PopupSettings = {
	event: 'focus-click',
	target: 'popupFocusClick',
	placement: 'left'
    };

    export let finderResult;

</script>

<button use:popup={popupFocusClick}>
    <span class="badge bg-primary-500">{finderResult.sensor_type}</span>
    <span class="flex-auto">{finderResult.collection}</span>
</button>
<div class="card p-4 w-72 shadow-xl" data-popup="popupFocusClick">
	<div>
		<img class="h-auto max-w-full rounded-lg" 
            src="{finderResult.thumbnail}" alt="">
	</div>
</div>


