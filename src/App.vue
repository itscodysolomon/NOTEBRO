<template>
  <v-app ref="note-bro">
    <v-app-bar dark dense app flat height="50" :color="activeTheme.value">
      <v-toolbar-title>NOTE <b>BRO</b></v-toolbar-title>
      <v-spacer />
      <v-btn small icon class="mr-2" @click="launchSettings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid class="pt-0">
        <v-row>
          <v-col class="pa-0 px-0">
            <Notes />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <Settings
      v-show="settings"
      v-bind:open="settings"
      v-on:settings-closed="closeSettings"
      v-on:dark-mode-rerender="reRender"
    />
    <Shortcuts
      v-show="shortcuts"
      v-bind:open="shortcuts"
      v-on:shortcuts-closed="closeShortcuts"
    />
    <v-footer flat app dense>
      <v-btn small icon class="ml-1" @click="launchShortcuts">
        <v-icon>mdi-keyboard</v-icon>
      </v-btn>
      <v-spacer />
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import Notes from "./components/Notes";
import Settings from "./components/Settings";
import Shortcuts from "./components/Shortcuts";
import * as shortcuts from "./keyboardShortcuts";

export default {
  name: "LayoutsDemosBaselineFlipped",

  props: {
    source: String
  },
  components: {
    Notes,
    Settings,
    Shortcuts
  },
  data: () => ({
    settings: false,
    shortcuts: false
  }),
  methods: {
    launchSettings: function() {
      this.settings = true;
    },
    closeSettings: function() {
      this.settings = false;
    },
    launchShortcuts: function() {
      this.shortcuts = true;
    },
    closeShortcuts: function() {
      this.shortcuts = false;
    },
    reRender: function() {
      this.$forceUpdate();
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    },
    activeTheme() {
      return this.$store.state.activeTheme;
    }
  },
  mounted() {
    this.reRender();
    shortcuts.allowShortcutsFocusedInput();
    shortcuts.closeSettingsShortcutsEsc(this);
    shortcuts.openSettings(this);
    shortcuts.openShortcuts(this);
  },
  updated() {
    this.$vuetify.theme.dark = this.darkMode;
  }
};
</script>
