// Utilities
import { defineStore } from 'pinia';
import { omscentral, omscentralAPI } from '@/utils/omscentral';
import { omsHubAPI, omshub } from '@/utils/omshub';
import axios from 'axios';

export const useAppStore = defineStore('app', {
  state: () => ({
    centralData: {},
    hubData: {}
  }),
  getters: {
    courseData(state){
      let cData = {}
      const names = new Set([...Object.keys(state.centralData), ...Object.keys(state.hubData)]);
      const averageKeys = ["rating", "difficulty", "workload"]

      for(const name of names){
        const central = state.centralData[name]
        const hub = state.hubData[name]

        // General data
        cData[name] = {...central, ...hub}

        if(central && hub){
          // Get averages for rating, difficulty, and workload
          for(let idx in averageKeys){
            cData[name][averageKeys[idx]] = (parseFloat(central[averageKeys[idx]]) + parseFloat(hub[averageKeys[idx]])) / 2;
          }
          // Get source(s)
          cData[name].sources = [central.source, hub.source]
        }

        if(central && !hub)
          cData[name] = {...central, sources: [central.source]}
        if(hub && !central) 
          cData[name] = {...hub, sources: [hub.source]}
      }
      return cData
    }
  },
  actions: {
    async fetchOMSCReviews(force=false){
      if(force || Object.keys(this.centralData).length === 0){
          const urls = omscentralAPI.courses.map((course)=>`${omscentralAPI.site}${omscentralAPI.sub}${course}/${omscentralAPI.filename}`)
          const response = await axios.all(urls.map((url)=>axios.get(url)))
          for(let res in response){
            const core = response[res].data.pageProps.course
            this.centralData[core.name] = {
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
    },
    
    async fetchOMSHub(force=false){
      if(force || Object.keys(this.hubData).length === 0){
          const response = await axios.get(omsHubAPI.filePath)
          const core = response.data  
          for (let idx in core) {
            this.hubData[core[idx].name] = {
              name: core[idx].name,
              number: core[idx].number,
              rating: core[idx].rating,
              difficulty: core[idx].difficulty,
              workload: core[idx].workload,
              source: omshub,
           }
          }
        }
      }
    }
});
