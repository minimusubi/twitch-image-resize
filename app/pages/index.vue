<template>
	<div class="d-flex min-vh-100">
		<DropTarget :type="type">
			<TransitionGroup name="question">
				<ImageTypeChoice
					key="type-choice"
					v-model="type"
				/>
				<ImageUpload
					v-if="type !== null"
					key="upload"
					:type="type"
				/>
				<UploadPreview />
			</TransitionGroup>
		</DropTarget>
	</div>
</template>

<script lang="ts" setup>
	const type = ref<ImageType | null>(null);
</script>

<style lang="scss" scoped></style>
<style lang="scss">
	// /* apply transition to moving elements */
	// .question-move,
	// .question-enter-active,
	// .question-leave-active {
	// 	transition: all 0.5s ease;
	// }

	// .question-enter-from,
	// .question-leave-to {
	// 	opacity: 0;
	// 	transform: translateY(-20px);
	// }

	.question-move,
	.question-enter-active {
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
	}

	.question-enter-active {
		opacity: 0;
		animation:
			0.5s slide-in 0s,
			0.5s fade-in 0.5s;
	}

	// /* ensure leaving items are taken out of layout flow so that moving
	// animations can be calculated correctly. */
	// .question-leave-active {
	// 	position: absolute;
	// }

	@keyframes slide-in {
		0% {
			transform: translateY(-20px);
		}
		100% {
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
