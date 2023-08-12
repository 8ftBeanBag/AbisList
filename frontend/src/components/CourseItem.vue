<template>
    <div><strong>{{ course.name }}</strong></div>
    <v-chip>#{{ course.number }}</v-chip>
    <v-chip v-for="tag in course.tags" :key="course.name+tag">{{ tag }}</v-chip>
</template>

<script setup>
const props = defineProps({
    course: Object
})
</script>