<script lang="ts">
	$: classesFromTheParent = $$props.class;
</script>

<div
	class="z-40 fixed top-12 left-0 w-full h-[calc(100%-3rem)] outline-none overflow-x-hidden overflow-y-auto bg-base-100"
	id="exampleModalScrollable"
	tabindex="-1"
	aria-labelledby="exampleModalScrollableLabel"
	aria-hidden="true"
>
	<div
		class="sm:h-[calc(100%-3rem)] my-6 mx-auto relative w-auto pointer-events-none  {classesFromTheParent} "
	>
		<div
			class="bg-neutral max-h-full overflow-hidden border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-clip-padding rounded-md outline-none text-current"
		>
			<div
				class="flex flex-shrink-0 items-center justify-between p-4 border-b border-none rounded-t-md"
			>
				<slot name="modal-title" />
			</div>
			<div class="flex-auto overflow-y-auto relative p-4">
				<slot name="modal-content" />
			</div>
			{#if $$slots['modal-buttons']}
				<div
					class="flex flex-shrink-0 flex-wrap items-center justify-end p-4 pt-1 border-t border-none rounded-b-md"
				>
					<slot name="modal-buttons" />
				</div>
			{/if}
		</div>
	</div>
</div>
