<script>
</script>

<div class="relative z-10 prose" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0   transition-opacity" />

	<div class="fixed z-10   inset-0  ">
		<div
			class="flex bg-base-100 items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
		>
			<div
				class="relative card  bg-neutral shadow-xl overflow-visible rounded-lg px-4 pb-4 text-left shadow-xl transform transition-all  sm:w-auto"
			>
				<slot />
			</div>
		</div>
	</div>
</div>
