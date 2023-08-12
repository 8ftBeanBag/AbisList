<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th>Course</th>
                <th>Rating</th>
                <th>Difficulty</th>
                <th>Workload (hrs/wk)</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="course in Object.values(courseData)">
                <td class="pa-2"><CourseItem :course="course"></CourseItem></td>
                <td>{{ Math.round(course.rating * 100)/100 }}</td>
                <td>{{ Math.round(course.difficulty * 100)/100 }}</td>
                <td>{{ Math.round(course.workload * 100)/100 }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import CourseItem from './CourseItem.vue';
const props = defineProps({
    courseData: Object,
})
</script>