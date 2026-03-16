<template>
	<div
		class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
		style="flex: 1"
		@dragenter.capture="onDragEnter"
		@dragleave.capture="onDragLeave"
		@dragover.capture="onDragOver"
		@drop.capture="onDrop"
		@mousedown="hoverEvents = 0"
		@paste="onPaste"
	>
		<slot></slot>
		<Teleport to="#teleports">
			<div
				ref="dropUiContainer"
				class="pe-none position-fixed top-0 end-0 bottom-0 start-0"
				style="opacity: 0"
				:style="{ pointerEvents: type === null ? undefined : 'none' }"
			>
				<div class="hover-ui"></div>
			</div>
		</Teleport>
	</div>
</template>

<script lang="ts" setup>
	const ALLOWED_EXTENSIONS = [
		'avif',
		'gif',
		'jpeg',
		'jpg',
		'png',
		'svg',
		'webm',
	];

	const props = defineProps<{
		type: ImageType | null;
	}>();
	const dropUiContainer = useTemplateRef('dropUiContainer');
	let hoverEvents = 0;
	const files = ref<Map<ImageType, File[]>>(new Map());

	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		hoverEvents++;

		if (props.type === null || dropUiContainer.value === null) {
			return;
		}

		dropUiContainer.value.style.opacity = '1';
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		hoverEvents--;

		if (props.type === null || dropUiContainer.value === null) {
			return;
		}

		if (hoverEvents === 0) {
			dropUiContainer.value.style.opacity = '0';
		}
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		hoverEvents = 0;

		processDataTransfer(event.dataTransfer);
	}

	function onPaste(event: ClipboardEvent) {
		event.preventDefault();
		hoverEvents = 0;

		processDataTransfer(event.clipboardData);
	}

	function processDataTransfer(dataTransfer: DataTransfer | null) {
		if (props.type === null || dropUiContainer.value === null) {
			return;
		}

		if (dataTransfer === null) {
			return;
		}

		if (!dataTransfer.types.includes('Files')) {
			return;
		}

		console.log({
			dropEffect: dataTransfer.dropEffect,
			effectAllowed: dataTransfer.effectAllowed,
			files: Array.from(dataTransfer.files),
			items: Array.from(dataTransfer.items),
			types: Array.from(dataTransfer.types),
		});

		dropUiContainer.value.style.opacity = '0';
		upload(dataTransfer.files);
	}

	async function upload(files: FileList) {
		const formData = new FormData();

		for (const file of files) {
			// Ensure the file uses an appropriate extension
			if (
				!ALLOWED_EXTENSIONS.some((extension) => {
					return file.name.toLowerCase().endsWith(extension);
				})
			) {
				continue;
			}

			formData.append('file', file, file.name);
		}

		const response = await $fetch(`/api/upload?type=${props.type}`, {
			method: 'POST',
			body: formData,
		});

		if (!response) {
			return;
		}

		download(response);
	}

	function splitFilename(filename: string) {
		const match = filename.match(/(.+)(\.[a-zA-z]+)$/);

		if (match === null) {
			return undefined;
		}

		return { basename: match[1], extension: match[2] };
	}

	async function delay(time: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, time);
		});
	}

	async function download(jsonResponse: ImageResponseMap) {
		for (const [filename, image] of Object.entries(jsonResponse)) {
			for (const [size, base64] of Object.entries(image)) {
				const split = splitFilename(filename);

				if (split === undefined) {
					continue;
				}

				downloadFile(
					base64,
					`${split.basename}-${size}x${size}${split.extension}`,
				);

				await delay(500);
			}
		}
	}

	function downloadFile(base64: string, filename: string) {
		const link = document.createElement('a');
		link.href = base64;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	provide('uploads', { files, upload });
</script>

<style lang="scss" scoped>
	.hover-ui {
		--hover-border-padding: 25px;

		position: fixed;
		height: calc(100% - calc(var(--hover-border-padding) * 2));
		width: calc(100% - calc(var(--hover-border-padding) * 2));
		margin: var(--hover-border-padding);
		background: rgba(0 0 0 / 30%);
		border: 2px dashed #1252a5;
		border-radius: 10px;
		transition: opacity 200ms ease;
		pointer-events: none;
		box-sizing: border-box;
	}
</style>
