<template>
  <v-container>
    <v-card>
      <div class="d-flex justify-center" v-if="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <v-tabs
        v-else
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="courses">Courses</v-tab>
        <v-tab value="reviews">Reviews</v-tab>
        <!-- <v-tab value="planner">Planner</v-tab> -->
      </v-tabs>

      <v-card-text v-if="!loading">
        <v-window v-model="tab">
          <v-window-item value="courses">
            <CoursesTable :courseData="Object.values(courses)" @filter-reviews="(val)=>{reviewFilter=val; tab='reviews'}"></CoursesTable>
          </v-window-item>

          <v-window-item value="reviews">
            <ReviewsList :reviews="reviews"></ReviewsList>
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
import { ref, onMounted, computed } from "vue";
import { omsHubAPI, omshub } from "@/utils/omshub";
import { omscentralAPI, omscentral } from "@/utils/omscentral";
import axios from "axios";
import { generateCentralCourses } from "@/utils/courses";
import { plannerApi } from "@/utils/planner";

const tab = ref(null)
const loading = ref(false);
const centralData = ref({});
const centralReviews = ref([]);
const hubData = ref({});
const plannerData = ref({});
const reviewFilter = ref("");

onMounted(async ()=>{
  loading.value = true;
  await fetchOMSHub();
  await fetchPlanner();

  // generate course names to use to retrieve data from OMSCentral
  const courseNames = generateCentralCourses([...Object.keys(plannerData.value), ...Object.keys(hubData.value)])
  await fetchOMSCentral(courseNames);
  loading.value = false;
});

const courses = computed(()=>{
  let cData = {}
  const names = new Set([...Object.keys(centralData.value), 
                         ...Object.keys(hubData.value), 
                         ...Object.keys(plannerData.value)]);
  const averageKeys = ["rating", "difficulty", "workload"];

  for(const name of names){
    const central = centralData.value[name]
    const hub = hubData.value[name]
    const planner = plannerData.value[name]

    // General data
    cData[name] = {...central, ...hub, sources: []};

    if(central && hub){
      // Get averages for rating, difficulty, and workload
      for(let idx in averageKeys){
        cData[name][averageKeys[idx]] = (parseFloat(central[averageKeys[idx]]) + parseFloat(hub[averageKeys[idx]])) / 2;
      }
      // Get source(s)
      cData[name].sources.push(...[central.source, hub.source])
    }

    else if(central && !hub)
      cData[name] = {...central, sources: [central.source]}
    else if(hub && !central) 
      cData[name] = {...hub, sources: [hub.source]}
    
    // Add in planner data
    if(planner) {
      // prioritize planner data name
      cData[name].name = planner.name;  
      cData[name].seats = planner.seats;
      cData[name].specializations = planner.specializations;
      cData[name].sources.push({name: "Planner", site: plannerApi.site})
    }
  }
  return cData
})

const reviews = computed(()=>{
  return reviewFilter.value.trim() ? centralReviews.value.filter(r=>r.course === reviewFilter.value) : centralReviews.value
});

async function fetchOMSCentral(names){
  const urls = names.map((course)=>[`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`, course])
    const proms = urls.map((url)=>axios.get(url[0]).then((response=>{return [response, url[1]]})).catch((err)=>{
      if(err.response === undefined){
        console.warn('Encountered CORS error (proabably)', err)
      }
      else if(err.response.status === 404){
      console.warn(`Couldn't get data for ${err.response.request.responseURL}`)
      }
      else
        console.error(err)
    }));
    let response = await axios.all(proms);

    for(let res in response){
      if(response[res] === undefined)
        continue

      const core = response[res][0].data.pageProps.course;
      centralReviews.value.push(...core.reviews.map(r=>({...r, course: core.name, source: omscentral})))
      centralData.value[core.name] = {
          tags: core.tags,
          creditHours: core.creditHours,
          name: core.name,
          number: core.codes[0],
          rating: core.rating,
          difficulty: core.difficulty,
          workload: core.workload,
          source: omscentral,
          url: core.officialURL,
          reviews: core.reviews,
          centralUrl: response[res][1]
      }
    }
}
    
async function fetchOMSHub(){
  const response = await axios.get(omsHubAPI.filePath)
  const core = response.data  
  for (let idx in core) {
      hubData.value[core[idx].name] = {
        name: core[idx].name,
        number: core[idx].number,
        rating: core[idx].rating,
        difficulty: core[idx].difficulty,
        workload: core[idx].workload,
        source: omshub,
    }
  }
}
      
async function fetchPlanner(){
  const response = await axios.get("/data/planner.json");
  const core = response.data;
  for (let idx in core) {
      plannerData.value[core[idx].course] = {
        name: core[idx].course,
        number: core[idx].number,
        tag: core[idx].tag,
        seats: core[idx].seats,
        specializations: core[idx].specializations,
    }
  }
}
</script>
