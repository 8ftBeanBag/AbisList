<template>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Search" v-model="searchedText"></v-text-field>
    <v-table density="compact" fixed-header height="calc(100vh - 200px)">
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
                <td class="pa-2"><CourseItem :course="course"></CourseItem></td>
                <td>{{ Math.round(course.rating * 100)/100 }}</td>
                <td>{{ Math.round(course.difficulty * 100)/100 }}</td>
                <td>{{ Math.round(course.workload * 100)/100 }}</td>
                <td><div :class="!course.seats ? '' : parseFloat(course.seats) > 0 ? 'bg-green' : isNaN(course.seats) ? 'bg-yellow' : 'bg-red'" class="rounded-circle pa-3 w-100 text-center">{{ course.seats }}</div></td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import { ref, watch } from 'vue';
import CourseItem from './CourseItem.vue';
import { computed } from 'vue';
const props = defineProps({
    courseData: Object,
})

const courses = ref(props.courseData)
const asc = ref({})
const searchedText = ref("")
const sortKey = ref('name')

function sort(key){
    sortKey.value = key;
    asc.value[key] = !asc.value[key];   // swap the sort direction
}

const searchedSorted = computed(()=>{
    const isNumber = ["rating", "workload", "difficulty", "seats"].includes(sortKey.value);
    courses.value.sort((a, b)=>{
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

    if(!searchedText.value.trim()){
        return courses.value;   
    }
    return courses.value.filter((course)=>{
        return Object.values(course).map((v)=>(typeof v === "string") ? v.includes(searchedText.value) : false).some((o)=>o)
    })
})


watch(props, (props)=>props.courseData, (newVal)=>{
    courses.value = newVal
})

</script>