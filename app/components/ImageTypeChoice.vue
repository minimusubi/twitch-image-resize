<template>
	<div class="">
		<h2 class="fs-4 text-center mb-4">whats this image for?</h2>
		<button
			v-for="({ label, value }, index) of buttons"
			:key="value"
			type="button"
			class="btn btn-primary rounded-pill"
			:class="{
				'btn-primary': type === value,
				'btn-secondary': type !== value,
				'me-4': index !== buttons.length - 1,
			}"
			@click="type = value"
		>
			{{ label }}
		</button>
	</div>
</template>

<script lang="ts" setup>
	import type { ImageButton } from '~/types/button';

	const type = defineModel<ImageType | null>();

	const buttons: ImageButton[] = [
		{ label: 'a subscriber badge', value: 'subscriber-badge' },
		{ label: 'a badge flair', value: 'badge-flair' },
		{ label: 'a bit badge', value: 'bit-badge' },
		{ label: 'a channel redeem', value: 'channel-redeem' },
	];
</script>

<style lang="scss" scoped></style>
