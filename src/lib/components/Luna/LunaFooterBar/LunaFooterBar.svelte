<script lang="ts">
	import { page } from "$app/stores";
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton";
	const popupFocusClick: PopupSettings = {
		event: "focus-click",
		target: "popupFocusClick",
		placement: "top",
	};
</script>

<div class="grid grid-cols-10">
	<div class="col-span-8"></div>
	<div class="col-span-2 card shadow-xl">
		<input
			type="text"
			class="input"
			placeholder="Chat with assistant"
			use:popup={popupFocusClick}
		/>
		<div
			class="card p-4 w-72 shadow-xl"
			data-popup="popupFocusClick"
		>
			<p>
				Lorem Ipsum is simply dummy text of the printing
				and typesetting industry. Lorem Ipsum has been
				the industry's standard dummy text ever since
				the 1500s, when an unknown printer took a galley
				of type and scrambled it to make a type specimen
				book. It has survived not only five centuries,
				but also the leap into electronic typesetting,
				remaining essentially unchanged. It was
				popularised in the 1960s with the release of
				Letraset sheets containing Lorem Ipsum passages,
				and more recently with desktop publishing
				software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>
		</div>
	</div>
</div>
