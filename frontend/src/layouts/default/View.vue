<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <a href="/" class="text-decoration-none text-white">Abi's</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" href="https://github.com/8ftBeanBag/AbisList" target="_blank" rel="noreferrer noopener">
          <v-icon icon="mdi-github" size="x-large"/>
      </v-btn>
      <v-btn variant="text" href="https://abigailhendrick.com" target="_blank" rel="noreferrer noopener">
        <v-avatar color="action" class="mx-2"><v-img src="@/assets/avatar.png"></v-img></v-avatar>
      </v-btn>
    </v-app-bar> 
    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
    >
      <v-list density="compact" nav v-model:opened="drawer">
        <v-list-item prepend-icon="mdi-home" title="Home" href="/"/>
        <v-list-item prepend-icon="mdi-information" title="About" href="/about"/>
        <v-list-item prepend-icon="mdi-email" title="Contact Info" href="/contact"/>
      </v-list>
    </v-navigation-drawer>
    <v-main id="main">
      <router-view /> 
    </v-main>
  </v-layout>

</template>

<script>
export default {
  data(){
    return {
      drawer: false,
    }
  },
}
</script>

