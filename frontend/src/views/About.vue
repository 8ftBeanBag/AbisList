<template>
    <v-container class="text-center">
        <p class="text-h1">About Abi's List</p>
        <div class="d-flex justify-center my-3">
            <p class="w-50 text-left">
                I got tired of trying to find info from 4+ sites on OMSCS classes so I came up with my own solution!
                It turns out that there's been some escapades in this area before and I certainly stand on the shoulders of 
                giants. Big shout out to my data sources.
            </p>
        </div>  
        <v-btn href="https://www.omscentral.com/" color="primary" class="me-2" target="_blank" rel="noopener noreferrer">OMSCentral</v-btn>
        <v-btn href="https://www.omshub.org/" color="primary" class="me-2" target="_blank" rel="noopener noreferrer">OMSHub</v-btn>
        <v-btn href="https://omscs.gatech.edu/" color="primary" class="me-2" target="_blank" rel="noopener noreferrer">OMSCS.gatech.edu</v-btn>
        <v-btn :href="plannerApi.site" color="primary" class="me-2" target="_blank" rel="noopener noreferrer">OMSCS.rocks</v-btn>
    
        <div class="d-flex justify-center">
            <div class="w-50 text-left mt-5 pa-5">
                <p class="text-h4">So how did you get this data?</p>
                <p class="mb-5">
                    I did a combination of investigating the data structures of my data sources and some scraping.
                    The scraping is only done on request or when Abi feels like it in order to protect the data sources.
                    The exception to this is OMSCentral which is breifly scraped for resources on startup.
                </p>
                <p class="text-h4">I own one of those data sources and I'm mad 😠</p>
                <p class="mb-5">
                    I'm super sorry about that. Please contact me immediately and we'll work things out
                    until you're not mad anymore. <a href="mailto:hello@abigailhendrick.com">hello@abigailhendrick.com</a>
                </p>
                <p class="text-h4">I love what you're doing and I'd like to support!</p>
                <p class="mb-5">
                    Awesome! Contact me at <a href="mailto:hello@abigailhendrick.com">hello@abigailhendrick.com</a> or make 
                    a pull request at my <a  href="https://github.com/8ftBeanBag/AbisList" target="_blank" rel="noreferrer noopener"><v-icon>mdi-github</v-icon>GitHub.</a>
                    I'll respond quickly.
                </p>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { plannerApi } from '@/utils/planner';

</script>
  