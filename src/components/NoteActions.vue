<template>
  <v-container fluid class="px-0 mx-0 py-0 my-0">
    <v-slide-y-transition class="pt-0 mt-0">
      <v-alert
        v-show="textCopied"
        dense
        text
        type="success"
        class="mx-4 ml-6 mt-0 mb-4"
        >text copied to clipboard</v-alert
      >
    </v-slide-y-transition>
    <v-card-actions class="pt-0 mt-0 mb-2">
      <v-slide-x-transition>
        <v-row v-show="caseButtons && !deleteModeActive && note.content" class="text-center ml-2 ma-0 pa-0">
          <v-chip
            color="primary"
            class="mr-4 my-0 ml-0"
            @click="toLower(note.content)"
            >lower case</v-chip
          >
          <v-chip
            color="primary"
            class="mr-4 my-0 ml-0"
            @click="toUpper(note.content)"
            >UPPER CASE</v-chip
          >
          <v-chip
            color="primary"
            class="mr-4 my-0 ml-0"
            @click="toTitle(note.content)"
            >Title Case</v-chip
          >
          <v-chip
            color="primary"
            class="mr-4 my-0 ml-0"
            @click="toDashed(note.content)"
            >dashed-case</v-chip
          >
        </v-row>
      </v-slide-x-transition>
      <v-spacer />
      <v-btn
        icon
        class="mr-1"
        :disabled="!note.content || deleteModeActive"
        @click="caseButtons = !caseButtons"
        :color="caseButtons ? 'primary' : ''"
      >
        <v-icon>mdi-format-letter-case</v-icon>
      </v-btn>

      <v-btn
        icon
        class="mr-1"
        :disabled="!note.content || deleteModeActive"
        v-clipboard:copy="note.content"
        v-clipboard:success="onCopy"
      >
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
      <v-btn v-if="!fullscreenActive" :disabled="deleteModeActive" icon v-on:click="$emit('full-screen-note', true)" class="mr-1">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
      <v-btn icon :disabled="!note.content || deleteModeActive" @click="saveFile(note)">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script>
const { dialog } = require("electron").remote;
const { remote } = require("electron");
import * as shortcuts from "../keyboardShortcuts";
let win = remote.getCurrentWindow();
const fs = require("fs");

export default {
  data() {
    return {
      textCopied: false,
      caseButtons: false
    };
  },
  props: ["note","fullscreenActive","deleteModeActive"],
  methods: {
    onCopy: function() {
      this.textCopied = true;
      setTimeout(() => {
        this.textCopied = false;
      }, 1000);
    },
    saveFile: async function(note) {
      const options = {
        defaultPath: note.title ? note.title + ".txt" : "untitled.txt",
        buttonLabel: "Save",
        filters: [{ name: "Text", extensions: ["txt"] }]
      };

      const save = await dialog.showSaveDialog(win, options);
      fs.writeFile(save.filePath, note.content, () => {
        let savedTitle = save.filePath
          .split("/")
          .slice(-1)
          .toString()
          .replace(".txt", "");
        if (savedTitle !== "untitled") {
          this.$emit("title-on-save", savedTitle);
        }
      });
    },
    toLower: function(text) {
      this.emitCaseChange(text.toLowerCase());
    },
    toUpper: function(text) {
      this.emitCaseChange(text.toUpperCase());
    },
    toTitle: function(text) {
      let titleText = text.toLowerCase().split(" ");
      for (let i = 0; i < titleText.length; i++) {
        titleText[i] = titleText[i][0].toUpperCase() + titleText[i].slice(1);
      }
      titleText = titleText.join(" ");
      this.emitCaseChange(titleText);
    },
    toDashed: function(text) {
      this.emitCaseChange(text.replace(/\s+/g, "-"));
    },
    emitCaseChange: function(text) {
      this.$emit("note-case-change", text);
    }
  },
  created: function() {
    shortcuts.saveFile(this);
  }
};
</script>
