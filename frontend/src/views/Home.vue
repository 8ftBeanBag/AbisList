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
        <v-tab value="planner">Planner</v-tab>
      </v-tabs>

      <v-card-text v-if="!loading">
        <v-window v-model="tab">
          <v-window-item value="courses">
            <CoursesTable :courseData="Object.values(courses)"></CoursesTable>
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

const tab = ref(null)
const loading = ref(false);
const centralData = ref({});
const centralReviews = ref([]);
const hubData = ref({});
const plannerData = ref({});

onMounted(async ()=>{
  loading.value = true;
  await fetchOMSCReviews()
  await fetchOMSHub();
  await fetchPlanner();
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
      console.log(planner)
      cData[name].name = planner.name;
      cData[name].seats = planner.seats;
      cData[name].specializations = planner.specializations;
      cData[name].sources.push({name: "Planner", site: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyHrRhH2V52bsYFEtm-8oJDaFOlyGYz6AKXm8WwsthN3fNP3KGkEx7O7D9ZHV3j2iKnzU2XHqoh4pQ/pubhtml"})
    }
  }
  return cData
})

const reviews = computed(()=>{
  return centralReviews.value;
});

async function fetchOMSCReviews(){
  const urls = omscentralAPI.courses.map((course)=>`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`)
  const response = await axios.all(urls.map((url)=>axios.get(url)))
  for(let res in response){
    const core = response[res].data.pageProps.course;
    core.reviews.source = omscentral;
    core.reviews.course = core.name;
    centralReviews.value.concat(...core.reviews)
    centralData.value[core.name] = {
        tags: core.tags,
        creditHours: core.creditHours,
        name: core.name,
        number: core.codes[0],
        rating: core.rating,
        difficulty: core.difficulty,
        workload: core.workload,
        source: omscentral,
        url: core.officialURL
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
