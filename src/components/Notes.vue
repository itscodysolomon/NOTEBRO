<template>
  <v-container class="px-0 mx-0 pt-0" flat fluid>
    <v-toolbar flat dense>
      <v-spacer />
      <v-btn icon small class="mr-4" :disabled="deleteMode" @click="addNote">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="mr-2"
        @click="deleteMode = !deleteMode"
        :color="deleteMode ? 'red lighten-1' : ''"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs v-model="tab" vertical class="px-6 pt-6">
      <v-tab v-for="note in notesInReverse" :key="note._id" class="pr-4">
        <span class="tab-title text-left">{{ getNoteTitle(note) }}</span>
        <v-slide-x-transition class="pt-0 mt-0">
          <v-btn
            icon
            color="red lighten-1"
            v-show="deleteMode"
            @click="deleteNote(note._id)"
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-slide-x-transition>
      </v-tab>
      <v-tabs-items v-model="tab" flat vertical>
        <v-tab-item
          v-for="note in notesInReverse"
          :key="note._id"
          flat
          :transition="false"
        >
          <v-card flat tile class="pl-2">
            <v-text-field
              solo
              flat
              dense
              single-line
              hide-details
              class="py-0 mb-0 pt-2 pl-1"
              placeholder="Untitled"
              v-model="note.title"
              @keyup="updateNote(note)"
              :autofocus="note.title.length < 1"
              :disabled="deleteMode"
            ></v-text-field>
            <v-divider class="ml-2 my-0 py-0"></v-divider>
            <v-textarea
              :clearable="true"
              placeholder="new note"
              v-model="note.content"
              no-resize
              :autofocus="note.title.length > 0"
              class="pa-4 pb-0 mt-0 mousetrap"
              @keyup="updateNote(note)"
              :disabled="deleteMode"
            ></v-textarea>
            <NoteActions
              v-bind:note="note"
              v-bind:deleteModeActive="deleteMode"
              v-on:full-screen-note="fullscreenNote = true"
              @title-on-save="titleUpdatedOnSave(note, $event)"
              @note-case-change="handleCaseChange($event, note._id)"
            />
            <v-overlay
              :value="fullscreenNote"
              class="fullscreen-textarea"
              opacity="1"
              :color="darkMode ? 'grey darken-4' : 'white'"
            >
              <v-container fluid>
                <v-btn
                  icon
                  @click="exitFullScreen"
                  class="float-right mt-5 mr-5"
                  :dark="darkMode"
                  :light="!darkMode"
                >
                  <v-icon>mdi-fullscreen-exit</v-icon>
                </v-btn>
                <v-card-subtitle>{{ note.title }}</v-card-subtitle>
                <v-textarea
                  placeholder="new note"
                  v-model="note.content"
                  no-resize
                  class="px-5 body-2"
                  @keyup="updateNote(note._id, note.content)"
                  :auto-grow="true"
                  :full-width="true"
                  :flat="true"
                  :autofocus="true"
                  style="width: 100%; height: 100%;"
                  :dark="darkMode"
                  :light="!darkMode"
                ></v-textarea>
                <NoteActions
              v-bind:note="note"
              v-bind:fullscreenActive="true"
              v-on:full-screen-note="fullscreenNote = true"
              @title-on-save="titleUpdatedOnSave(note, $event)"
              @note-case-change="handleCaseChange($event, note._id)"
            />
              </v-container>
            </v-overlay>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import NoteActions from "./NoteActions";
import * as shortcuts from "../keyboardShortcuts";
const Datastore = require("nedb");
let db = new Datastore({ filename: "notes.db", autoload: true });

export default {
  components: {
    NoteActions
  },
  data() {
    return {
      tab: null,
      notes: [],
      textCopied: false,
      overlay: false,
      fullscreenNote: false,
      deleteMode: false,
      caseButtons: false,
      addNotesClicked: false
    };
  },
  methods: {
    getNotes: async function() {
      return new Promise(resolve => {
        db.find({}, (err, res) => {
          this.notes = res;
          this.tab = this.notes.length - 1;
          resolve();
        });
      });
    },
    addNote: async function() {
      this.addNotesClicked = true;
      await db.insert(
        { _id: Date.now(), title: "", content: "" },
        (err, res) => {
          if (res) {
            this.getNotes();
          }
        }
      );
    },
    deleteNote: function(noteID) {
      if (this.notes.length < 2) {
        this.addNote();
      }

      const deleteNoteFromDB = () => {
        db.remove({ _id: noteID }, {}, (err, success) => {
          if (success) {
            this.getNotes();
          }
        });
      };
      deleteNoteFromDB();
    },
    updateNote: function(note) {
      db.update(
        { _id: note._id },
        { $set: { title: note.title, content: note.content } },
        {}
      );
    },
    getNoteTitle(note) {
      if (note.title) {
        return note.title;
      } else if (note.content) {
        return note.content;
      } else {
        return "New Note";
      }
    },
    titleUpdatedOnSave(note, noteTitle) {
      let updatedNote = note;
      updatedNote["title"] = noteTitle;
      this.updateNote(updatedNote);
    },
    exitFullScreen() {
      this.fullscreenNote = false;
    },
    handleCaseChange(value, id) {
      db.update({ _id: id }, { $set: { content: value } }, {});
      this.getNotes();
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    },
    notesInReverse() {
      return this.notes.slice().reverse();
    }
  },
  mounted: async function() {
    await this.getNotes();
    this.tab = 0; // make sure top tab is active on load
  },
  created: function() {
    shortcuts.exitFullscreen(this);
    shortcuts.addNewNote(this);
    shortcuts.deleteMode(this);
  }
};
</script>

<style>

.tab-title {
  white-space: nowrap;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fullscreen-textarea .v-overlay__content {
  width: 100% !important;
  height: 100% !important;
  overflow: scroll;
}

textarea {
  min-height: 40vh !important;
}

.v-tabs-bar {
  overflow: scroll;
  height: 70vh !important;
}

.v-slide-group__wrapper {
  display:  block !important;
  overflow: scroll !important;
}

</style>
