<template>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Search" v-model="searchedText"></v-text-field>
    <v-table density="compact" fixed-header height="calc(100vh - 200px)">
        <thead>
            <tr>
                <th>Course <button @click="()=>sort('name')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Rating/5 <button @click="()=>sort('rating')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Difficulty/5 <button @click="()=>sort('difficulty')"><v-icon>mdi-swap-vertical</v-icon></button></th>
                <th>Workload (hrs/wk) <button @click="()=>sort('workload')"><v-icon>mdi-swap-vertical</v-icon></button></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="course in searchedSorted">
                <td class="pa-2"><CourseItem :course="course"></CourseItem></td>
                <td>{{ Math.round(course.rating * 100)/100 }}</td>
                <td>{{ Math.round(course.difficulty * 100)/100 }}</td>
                <td>{{ Math.round(course.workload * 100)/100 }}</td>
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

const courses = ref(Object.values(props.courseData))
const asc = ref({})
const searchedText = ref("")
const sortKey = ref('name')

function sort(key){
    sortKey.value = key;
    asc.value[key] = !asc.value[key];   // swap the sort direction
}

const searchedSorted = computed(()=>{
    courses.value.sort((a, b)=>{
        // Sort numerically
        if(["rating", "workload", "difficulty"].includes(sortKey.value)){
            return asc.value[sortKey.value] ? a[sortKey.value] - b[sortKey.value] : b[sortKey.value] - a[sortKey.value];
        }
        // Sort alphabetically
        return asc.value[sortKey.value] ? a[sortKey.value].localeCompare(b[key]) : b[sortKey.value].localeCompare(a[sortKey.value]);
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