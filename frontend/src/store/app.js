// Utilities
import { defineStore } from 'pinia';
import { omscentral, omscentralAPI } from '@/utils/omscentral';
import { omsHubAPI } from '@/utils/omshub';
import axios from 'axios';

export const useAppStore = defineStore('app', {
  state: () => ({
    courseData: {}
  }),
  actions: {
    async fetchOMSCReviews(force=false){
      if(force || Object.keys(this.courseData).length === 0){
          const urls = omscentralAPI.courses.map((course)=>`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`)
          const response = await axios.all(urls.map((url)=>axios.get(url)))
          for(let res in response){
            const core = response[res].data.pageProps.course
            this.courseData[core.name] = {
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
    },
  }
});
