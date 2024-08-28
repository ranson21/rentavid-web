<script>
	export let size = 100;
</script>

<div
	style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100vh;"
>
	<div style="width: {size}px; height: {size}px;">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
			<style>
				.dvd {
					fill: #007bff;
					opacity: 0;
					animation: fall 1s ease-in-out infinite;
				}

				.dvd-1 {
					animation-delay: 0s;
				}
				.dvd-2 {
					animation-delay: 0.2s;
				}
				.dvd-3 {
					animation-delay: 0.4s;
				}

				@keyframes fall {
					0% {
						transform: translateY(-20px);
						opacity: 0;
					}
					50% {
						opacity: 1;
					}
					100% {
						transform: translateY(0);
						opacity: 0;
					}
				}
			</style>

			<g>
				<path d="M10,70 L90,70 L80,95 L20,95 Z" fill="#333" />
				<circle cx="30" cy="87" r="5" fill="#ccc" />
				<circle cx="70" cy="87" r="5" fill="#ccc" />

				<rect class="dvd dvd-1" x="35" y="50" width="10" height="5" />
				<rect class="dvd dvd-2" x="50" y="40" width="10" height="5" />
				<rect class="dvd dvd-3" x="65" y="30" width="10" height="5" />
			</g>
		</svg>
	</div>
</div>
