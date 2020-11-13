<template>
  <v-app class="fill-height">
    <v-main class="fill-height">
      <v-container class="fill-height">
        <Chat/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Chat from './components/Chat.vue';

@Component({
  components: {
    Chat,
  },
})
export default class App extends Vue {}
</script>

<style>
html {
  height: 100%;
}

body {
  height:100%;
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
