<template>
  <v-container>
    <v-card>
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="courses">Courses</v-tab>
        <v-tab value="reviews">Reviews</v-tab>
        <v-tab value="planner">Planner</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="courses">
            <CoursesTable :courseData="courseData"></CoursesTable>
          </v-window-item>

          <v-window-item value="reviews">
            <ReviewsList></ReviewsList>
          </v-window-item>

          <v-window-item value="planner">
            <PlannerApp></PlannerApp>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import CoursesTable from "@/components/CoursesTable.vue"
import ReviewsList from "@/components/ReviewsList.vue"
import PlannerApp from "@/components/PlannerApp.vue"
import { ref, onMounted } from "vue";
import axios from "axios"

const tab = ref(null)
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
const omscentral = {name: "OMSCentral", site: omscentralAPI.site}

onMounted(()=>{
    const urls = omscentralAPI.courses.map((course)=>`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`)
    axios.all(urls.map((url)=>axios.get(url)))
    .then((res)=>formatOMSC(res))
    .catch(()=>alert("Oops, data didn't load :("))
});

const formatOMSC = (response)=>{
    for(let res in response){
        const core = response[res].data.pageProps.course
        courseData.value[core.number] = {
            tags: core.tags,
            creditHours: core.creditHours,
            name: core.name,
            reviews: core.reviews,
            number: core.codes[0],
            rating: core.rating,
            difficulty: core.difficulty,
            workload: core.workload,
            source: omscentral,
            url: core.officialURL
        }
    }
}
</script>
