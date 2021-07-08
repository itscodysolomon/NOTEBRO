// Keyboard shortcuts

import Mousetrap from "mousetrap";

export const allowShortcutsFocusedInput = () => {
  Mousetrap.prototype.stopCallback = function() {
    return false;
  };
};

export const openSettings = component => {
  Mousetrap.bind("mod+,", () => {
    component.launchSettings();
  });
};

export const openShortcuts = component => {
  Mousetrap.bind("mod+k", () => {
    component.launchShortcuts();
  });
};

export const closeSettingsShortcutsEsc = component => {
  window.addEventListener("keydown", event => {
    if (event.keyCode === 27 && (component.settings || component.shortcuts)) {
      event.preventDefault();
      component.closeSettings();
      component.closeShortcuts();
    }
  });
};

export const exitFullscreen = component => {
  window.addEventListener("keyup", event => {
    if (event.keyCode === 27) {
      component.exitFullScreen();
    }
  });
};

export const addNewNote = component => {
  Mousetrap.bind("mod+n", () => {
    component.addNote();
    return true;
  });
};

export const deleteMode = (component) => {
  Mousetrap.bind("mod+d", () => {
    if(!component.fullscreenNote) {
      component.deleteMode = !component.deleteMode;
    }
  });
};

export const saveFile = component => {
  Mousetrap.bind("mod+s", () => {
    if (component.note.content) {
      component.saveFile(component.note);
    }
  });
};
