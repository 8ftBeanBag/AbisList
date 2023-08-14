<template>
    <div class="mb-1">
        <strong>{{ course.name }}
            <v-chip color="amber" class="ms-2">#{{ course.number }}</v-chip>
        </strong>
    </div>
    <v-chip v-for="tag in course.tags" :key="course.name+tag" class="me-2 mb-1">{{ tag }}</v-chip>
    <v-chip color="green" class="me-2" v-if="course.url">
        <a :href="course.url" target="_blank" rel="noreferrer noopener">
            <v-icon>mdi-information</v-icon>
        </a>
    </v-chip>
    <v-chip color="blue" class="me-2 mb-1" v-if="course.centralUrl">
        <a :href="encodeURI(`${omscentralAPI.site}/courses/${course.centralUrl}/reviews`)" target="_blank" rel="noreferrer noopener">OMSCentral</a>
    </v-chip>
    <v-chip color="blue" class="me-2 mb-1" v-if="course.sources.map(s=>s.name).includes('OMSHub')">
        <a :href="encodeURI(`${omsHubAPI.site}course/${course.number}`)" target="_blank" rel="noreferrer noopener">OMSHub</a>
    </v-chip>
    <v-chip color="blue" class="me-2 mb-1" v-if="course.sources.map(s=>s.name).includes('Planner')">
        <a :href="`${plannerApi.site}`" target="_blank" rel="noreferrer noopener">Planner</a>
    </v-chip>
    <v-chip color="purple" class="me-2 mb-1" v-if="course.reviews && course.reviews.length > 0">
        <button @click="$emit('reviews', course.name)"><v-icon>mdi-file</v-icon>Reviews</button>
    </v-chip>
    <span v-if="course.specializations">
        <span v-for="spec in Object.keys(course.specializations)" :key="spec+course.name">
            <v-chip color="orange" class="me-2 mb-1" v-if="course.specializations[spec].trim()">
                <button @click="$emit('specialization', spec)">
                    <span><v-icon>mdi-filter</v-icon>{{ spec }}</span>
                </button>
            </v-chip>
        </span>
    </span>
</template>

<script setup>
import { omscentralAPI } from '@/utils/omscentral';
import { omsHubAPI } from '@/utils/omshub';
import {plannerApi} from "@/utils/planner"
const props = defineProps({
    course: Object
});
defineEmits(['reviews', 'specialization']);
</script>