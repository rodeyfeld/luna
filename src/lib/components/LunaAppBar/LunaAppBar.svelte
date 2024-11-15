<script lang="ts">
	import { AppBar, popup } from '@skeletonlabs/skeleton';
</script>

<AppBar shadow="shadow-2xl" slotTrail="!space-x-2">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">

			<span><b>LUNA</b></span>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Explore -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'features' }}>
				<span>Extras</span>
				<i class="fa-solid fa-caret-down opacity-50"></i>
			</button>
			<!-- popup -->
			<div class="card p-4 w-60 shadow-xl" data-popup="features">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/">
								<span class="w-6 text-center"><i class="fa-solid fa-home"></i></span>
								<span>Homepage</span>
							</a>
						</li>
						<li>
							<a href="/#">
								<span class="w-6 text-center"><i class="fa-solid fa-book"></i></span>
								<span>Documentation</span>
							</a>
						</li>
						<li>
							<a href="/#">
								<span class="w-6 text-center"><i class="fa-solid fa-bullhorn"></i></span>
								<span>Providers</span>
							</a>
						</li>
						<hr class="!my-3" />
						<li>
							<a href="/#">
								<span>Configuration</span>
							</a>
						</li>
						<li>
							<a href="/#">
								<span>Satellites</span>
							</a>
						</li>
						<li>
							<a href="/#">
								<span class="w-6 text-center"><i class="fa-solid fa-screwdriver-wrench"></i></span>
								<span>Utilities</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>


	</svelte:fragment>
</AppBar>