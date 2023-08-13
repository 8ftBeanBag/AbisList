<template>
    <div class="pa-3">
        <v-card v-for="review in reviews" elevation="3" class="mb-5">
            <v-card-title>{{ review.course }}</v-card-title>
            <v-card-subtitle>Difficulty: {{ review.difficulty }}/5 | Workload: {{ review.workload }} hrs/wk | Overall: {{ review.rating }}/5</v-card-subtitle>
            <v-card-text>{{ review.body }}</v-card-text>
        </v-card>
    </div>
</template>

<script setup>
const props = defineProps({
    reviews: Array
})
</script>