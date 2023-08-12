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
            <CoursesTable :courseData="store.courseData"></CoursesTable>
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
import { useAppStore } from "@/store/app"

const store = useAppStore();
const tab = ref(null)

onMounted(()=>{
  store.fetchOMSCReviews();
});
</script>
