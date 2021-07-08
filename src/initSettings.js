// Set up initial application theme and dark mode settings

const Datastore = require("nedb");
let settings = new Datastore({
  filename: "settings.db",
  autoload: true
});

import { store } from "./store";

const setSettings = async setting => {
  return new Promise(resolve => {
    settings.find(
      {
        _id: setting.id
      },
      (err, res) => {
        store.commit(setting.mutation, res[0][setting.commit]);
        resolve();
      }
    );
  });
};

export async function initSettings() {
  const settings = [
    {
      id: "darkMode",
      mutation: "toggleDarkMode",
      commit: "active"
    },
    {
      id: "theme",
      mutation: "changeTheme",
      commit: "theme"
    }
  ];

  for (const setting of settings) {
    await setSettings(setting);
  }
}
