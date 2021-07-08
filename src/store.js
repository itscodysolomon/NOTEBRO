import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    darkMode: false,
    activeTheme: {}
  },
  mutations: {
    toggleDarkMode(state, mode) {
      state.darkMode = mode;
    },
    changeTheme(state, theme) {
      state.activeTheme = theme;
    }
  },
  actions: {},
  getters: {}
});
