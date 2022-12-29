<div
	class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
>
	<div class="lds-dual-ring" />
</div>

<style>
	.lds-dual-ring {
		display: inline-block;
		width: 140px;
		height: 140px;
	}
	.lds-dual-ring:after {
		content: ' ';
		display: block;
		width: 100px;
		height: 100px;
		margin: 8px;
		border-radius: 50%;
		border: 8px solid hsl(var(--a));
		border-color: hsl(var(--a)) transparent hsl(var(--a)) transparent;
		animation: lds-dual-ring 1.2s linear infinite;
	}
	@keyframes lds-dual-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
