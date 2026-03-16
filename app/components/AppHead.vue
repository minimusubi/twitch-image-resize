<template>
	<!-- No content -->
	<!-- Slot is only used to resolve hydration mismatch issues -->
	<slot></slot>
</template>

<script lang="ts" setup>
	useHead({
		// title: inject('app-name'),
	});
</script>
