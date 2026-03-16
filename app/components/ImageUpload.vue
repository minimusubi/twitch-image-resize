<template>
	<div class="d-flex flex-column align-items-center w-100 py-5">
		<div class="d-flex flex-column p-4">
			<span
				class="material-symbols-outlined mx-auto mb-3"
				style="font-size: 4rem; user-select: none; cursor: pointer"
				@click="filePicker?.click()"
				>add_photo_alternate</span
			>
			<h2 class="fs-4 text-center">choose, drop, or paste an image.</h2>
			<div class="fs-6 text-center text-secondary">
				(avif, gif, jpeg, jpg, png, svg, webm)
			</div>
			<input
				ref="file-picker"
				type="file"
				class="d-none"
				accept=".avif,.gif,.jpeg,.jpg,.png,.svg,.webm"
				multiple
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		type: ImageType | null;
	}>();
	const filePicker = useTemplateRef('file-picker');
	const { upload } = inject<{ upload: (files: FileList) => void }>(
		'uploads',
	)!;

	onMounted(() => {
		if (filePicker.value === null) {
			return;
		}

		filePicker.value.addEventListener('change', () => {
			if (filePicker.value!.files!.length === 0) {
				return;
			}

			upload(filePicker.value!.files!);
		});
	});
</script>

<style lang="scss" scoped></style>
