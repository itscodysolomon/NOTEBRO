<template>
  <v-row justify="center">
    <v-dialog
      v-model="open"
      v-on:click:outside="closeSettings"
      scrollable
      max-width="500px"
    >
      <v-card :color="darkMode ? '#333' : false" class="px-4">
        <v-card-title class="ml-0 pl-4 py-4">Settings</v-card-title>
        <v-divider></v-divider>
        <v-container>
          <v-row class="d-flex align-center mt-1">
            <v-card-subtitle class="ml-0 pl-4">Theme:</v-card-subtitle>
            <v-btn
              v-for="color in themeColors"
              v-bind:key="color.name"
              small
              icon
              :color="color.value"
              @click="changeTheme(color)"
            >
              <v-icon v-if="activeTheme.name === color.name">mdi-check</v-icon>
              <v-icon v-else>mdi-circle</v-icon>
            </v-btn>
          </v-row>
          <v-row class="d-flex align-center mt-1">
            <v-card-subtitle class="ml-0 pl-4">Dark Mode:</v-card-subtitle>
            <v-btn
              small
              icon
              class="mr-4"
              :color="darkMode ? 'primary' : ''"
              @click="toggleDarkMode"
            >
              <v-icon>mdi-weather-night</v-icon>
            </v-btn>
          </v-row>
          <div class="my-2 text-center">
            <v-btn color="primary" @click="closeSettings" text>Update</v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
const Datastore = require("nedb");
let db = new Datastore({ filename: "settings.db", autoload: true });
import { themes } from "../themes";

export default {
  props: ["open"],
  data: () => ({
    themeColors: themes,
  }),
  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    },
    activeTheme() {
      return this.$store.state.activeTheme;
    },
  },
  methods: {
    closeSettings: function() {
      this.$emit("settings-closed");
    },
    toggleDarkMode: function() {
      db.update({ _id: "darkMode" }, { $set: { active: !this.darkMode } }, {});
      this.$store.commit("toggleDarkMode", !this.darkMode);
      this.darkModeChangeReRender();
    },
    changeTheme: function(color) {
      db.update({ _id: "theme" }, { $set: { theme: color } }, {});
      this.$store.commit("changeTheme", color);
    },
    darkModeChangeReRender: function() {
      this.$emit("dark-mode-rerender");
    },
  },
};
</script>

<style>
.white-check {
  color: white;
}
</style>
