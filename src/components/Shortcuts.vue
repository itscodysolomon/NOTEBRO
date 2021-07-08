<template>
  <v-row justify="center">
    <v-dialog
      v-model="open"
      v-on:click:outside="closeShortcuts"
      scrollable
      max-width="500px"
    >
      <v-card :color="darkMode ? '#333' : false" class="px-4">
        <v-card-title class="ml-0 pl-4 py-4">Shortcuts</v-card-title>
        <v-divider></v-divider>
        <v-container>
          <template v-for="shortcut in shortcuts">
            <v-row class="d-flex align-center mt-1" :key="shortcut.name">
              <v-card-subtitle class="ml-0 pl-4 pr-2 col-6"
                >{{ shortcut.name }}:</v-card-subtitle
              >
              <v-card-subtitle>{{ shortcut.shortcut }}</v-card-subtitle>
            </v-row>
          </template>

          <div class="my-2 text-center">
            <v-btn color="primary" @click="closeShortcuts" text>Close</v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["open"],
  data: () => ({
    shortcuts: [
      { name: "New Note", shortcut: "Cmd + N" },
      { name: "Download Note", shortcut: "Cmd + S" },
      { name: "Delete Mode", shortcut: "Cmd + D" },
      { name: "Settings Menu Open | Close", shortcut: "Cmd + , | Esc" },
      { name: "Shortcuts Menu Open | Close", shortcut: "Cmd + K | Esc" },
      { name: "Hide/Show Note Bro Window", shortcut: "Control + B" }
    ]
  }),
  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    }
  },
  methods: {
    closeShortcuts: function() {
      this.$emit("shortcuts-closed");
    }
  }
};
</script>
