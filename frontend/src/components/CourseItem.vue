<template>
    <div class="mb-1">
        <strong>{{ course.name }}
            <v-chip color="amber" class="ms-2">#{{ course.number }}</v-chip>
        </strong>
    </div>
    <v-chip v-for="tag in course.tags" :key="course.name+tag" class="me-2">
        <button @click="$emit('filter', tag)">{{ tag }}</button>
    </v-chip>
    <v-chip color="green" class="me-2">
        <a :href="course.url" target="_blank" rel="noreferrer noopener">
            <v-icon>mdi-information</v-icon>
        </a>
    </v-chip>
    <v-chip color="blue" class="me-2" v-for="source in course.sources">
        <a :href="source.site" target="_blank" rel="noreferrer noopener">{{ source.name }}</a>
    </v-chip>
    <v-chip color="purple" class="me-2">
        <button  @click="$emit('reviews', course.name)">Reviews</button>
    </v-chip>
</template>

<script setup>
const props = defineProps({
    course: Object
});
defineEmits(['reviews', 'filter']);
</script>