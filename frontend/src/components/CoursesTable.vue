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
            <tr v-for="course in courseData">
                <td><CourseItem :course="course"></CourseItem></td>
                <td>{{ Math.round(course.rating * 100)/100 }}</td>
                <td>{{ Math.round(course.difficulty * 100)/100 }}</td>
                <td>{{ Math.round(course.workload * 100)/100 }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import CourseItem from './CourseItem.vue';
import { ref, onMounted } from 'vue';
import axios from "axios"

const courseData = ref([])

const omscentralAPI = {
    site: "https://www.omscentral.com/",
    sub: "_next/data/Rem_Stspc3vMLJaFAuLYs/courses/",
    filename: "reviews.json",
    courses : [
        "advanced-topics-in-software-analysis-and-testing", 
        "software-development-process", 
        "graduate-introduction-to-operating-systems", 
        "knowledge-based-ai",
        "data-and-visual-analytics"
    ]
}
onMounted(()=>{
    const urls = omscentralAPI.courses.map((course)=>`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`)
    axios.all(urls.map((url)=>axios.get(url, {mode: "nocors"})))
    .then((res)=>formatOMSC(res))
    .catch(()=>alert("Oops, data didn't load :("))
});

const formatOMSC = (response)=>{
    for(let res in response){
        const core = response[res].data.pageProps.course
        courseData.value.push({
            tags: core.tags,
            creditHours: core.creditHours,
            name: core.name,
            reviews: core.reviews,
            number: core.codes[0],
            rating: core.rating,
            difficulty: core.difficulty,
            workload: core.workload
        })
    }
}
</script>