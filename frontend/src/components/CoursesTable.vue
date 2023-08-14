<template>
    <v-row class="ma-0 pa-0">
        <v-col class="v-col-4 ma-0 pa-1">
            <v-text-field hide-details prepend-inner-icon="mdi-magnify" label="Search" v-model="searchedText"></v-text-field>
        </v-col>
        <v-col class="ma-0 pa-1">
            <v-select
                chips
                label="Select"
                :items="filters"
                :label="'Filters'"
                multiple
                v-model="selectedFilters"
                hide-details
            ></v-select>
        </v-col>
    </v-row>
    <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-1">
            <v-switch
                v-model="noNaN"
                label="Courses with Ratings"
                color="green"
                hide-details
            ></v-switch>
        </v-col>
        <v-col class="ma-0 pa-1">
            <v-switch
                v-model="seatsAvailable"
                label="Courses with Seats Available"
                color="green"
                hide-details
            ></v-switch>
        </v-col>
    </v-row>
    <v-table density="compact" fixed-header height="100vh">
        <thead>
            <tr>
                <th>Course <button @click="()=>sort('name')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Rating/5 <button @click="()=>sort('rating')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Difficulty/5 <button @click="()=>sort('difficulty')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Workload (hrs/wk) <button @click="()=>sort('workload')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Seats <button @click="()=>sort('seats')"><v-icon>mdi-swap-vertical</v-icon></button></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="course in searchedSorted">
                <td class="pa-2">
                    <CourseItem 
                        :course="course" 
                        @reviews="(val)=>$emit('filterReviews', val)"
                        @specialization="val=>specialization = val"></CourseItem>
                </td>
                <td>{{ Math.round(course.rating * 100)/100 }}</td>
                <td>{{ Math.round(course.difficulty * 100)/100 }}</td>
                <td>{{ Math.round(course.workload * 100)/100 }}</td>
                <td>
                    <a 
                        :href="plannerApi.site" 
                        :class="!course.seats ? '' : parseFloat(course.seats) > 0 ? 'bg-green' : isNaN(course.seats) ? 'bg-yellow' : 'bg-red'" 
                        class="rounded-circle pa-3 w-100 text-center d-inline-block"
                        target="_blank"
                        rel="noopener noreferrer">
                        {{ course.seats }}
                    </a>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import { ref, watch } from 'vue';
import CourseItem from './CourseItem.vue';
import { computed } from 'vue';
import { plannerApi } from '@/utils/planner';

const props = defineProps({
    courseData: Object,
})
defineEmits(['filterReviews']);

const courses = ref(props.courseData);
const asc = ref({});
const searchedText = ref("");
const sortKey = ref('name');
const specialization = ref("");
const noNaN = ref(true);
const seatsAvailable = ref(false);

function sort(key){
    sortKey.value = key;
    asc.value[key] = !asc.value[key];   // swap the sort direction
}

const selectedFilters = ref([]);
const filters = computed(()=>{
    let filtered = courses.value.map((course)=>{
        return course.specializations ? Object.keys(course.specializations) : []
    }).flat()
    return filtered.filter((item, index) => filtered.indexOf(item) === index);
});

const searchedSorted = computed(()=>{
    let filtered = [...courses.value];
    const isNumber = ["rating", "workload", "difficulty", "seats"].includes(sortKey.value);
    filtered.sort((a, b)=>{
        // Clean the data
        let aKey = sortKey.value in a ? a[sortKey.value] : isNumber ? 0 : "";
        let bKey = sortKey.value in b ? b[sortKey.value] : isNumber ? 0 : "";
        
        // If undefined sort to the bottom
        if(aKey === undefined || (isNumber && isNaN(aKey)))
            return -1;  
        if(bKey === undefined || (isNumber && isNaN(bKey)))
            return 1

        // Sort numerically
        if(isNumber){
            return asc.value[sortKey.value] ? aKey - bKey : bKey - aKey;
        }
        // Sort alphabetically
        return asc.value[sortKey.value] ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
    })

    // Specialization Filters
    if(selectedFilters.value.length > 0){
        selectedFilters.value.forEach((filter)=>{
            filtered = filtered.filter((course)=>course.specializations && course.specializations[filter])
        });
    }

    // NaN Filter
    if(noNaN.value){
        filtered = filtered.filter(course=>(!isNaN(course.rating) && !isNaN(course.difficulty) && !isNaN(course.workload)))
    }
    // Seats Filter
    if(seatsAvailable.value){
        filtered = filtered.filter(course=>course.seats && (course.seats > 0));
    }
    
    // Search
    if(searchedText.value.trim()){
        filtered = filtered.filter((course)=>{
            return Object.values(course).map((v)=>(typeof v === "string") ? v.includes(searchedText.value) : false).some((o)=>o)
        })
    }
    return filtered
});

watch(props, (props)=>props.courseData, (newVal)=>{
    courses.value = newVal
}, {deep: true})

</script>