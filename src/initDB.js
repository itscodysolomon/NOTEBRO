// Sets up the initial DB for NoteBro

const Datastore = require("nedb");
let settings = new Datastore({
  filename: "settings.db",
  autoload: true
});
let notes = new Datastore({
  filename: "notes.db",
  autoload: true
});

import { themes } from "./themes";

const isDB = async db => {
  return new Promise(resolve => {
    db.count({}, function(err, count) {
      resolve(count > 0);
    });
  });
};

const initSettingsDB = async () => {
  return new Promise(resolve => {
    settings.insert(
      [
        {
          _id: "darkMode",
          active: false
        },
        {
          _id: "theme",
          theme: themes[0]
        }
      ],
      () => {
        resolve();
      }
    );
  });
};

const initNotesDB = async () => {
  return new Promise(resolve => {
    notes.insert(
      {
        _id: Date.now(),
        title: "",
        content: ""
      },
      () => {
        resolve();
      }
    );
  });
};

export async function initDBs() {
  const isSettings = await isDB(settings);
  const isNotes = await isDB(notes);
  if (!isSettings) {
    await initSettingsDB();
  }
  if (!isNotes) {
    await initNotesDB();
  }
}
