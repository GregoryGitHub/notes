import Formatter from "./formatter.js";
import Builder from "./builder.js";

class Core {
  constructor() {
    this.noteList = document.getElementById("note-list");
    this.editor = document.getElementById("editor");
    this.noteDate = document.getElementById("note-date");
    this.editor.spellcheck = false;
    this.notes = [];
    this.activeNoteIndex = 0;
    this.formatter = new Formatter();
    this.builder = new Builder();
    this.onInit();
  }

  onInit() {
    this.loadState();
    this.render();
    this.editor.addEventListener("input", this.listenInput);
    this.editor.addEventListener("keydown", (e) => {
      if (e.key == "Tab") {
        document.execCommand("insertHTML", false, "&nbsp&nbsp");
      }
    });
  }

  listenInput = (event) => {
    this.getActiveNote().title = this.getTitleText();
    this.getActiveNote().resume = this.getResumeText();
    this.getActiveNote().editor = this.editor.innerHTML;

    this.saveState();
    this.renderActiveNote();
  };

  renderActiveNote() {
    const { title, resume, dateTime, editor } = this.getActiveNote();
    const activeItemDom = document.querySelector(
      `[data-note-index="${this.activeNoteIndex}"]`
    );
    activeItemDom.children[0].innerText = title;
    activeItemDom.children[2].innerText = resume;
  }

  render() {
    this.resetList();
    this.notes.forEach((note, noteIndex) => {
      const { title, resume, active, editor } = note;
      const { extense, abrev } = this.formatter.formatNoteDate(note.dateTime);
      const listItem = this.builder.buildNoteListItem(
        title,
        resume,
        active,
        noteIndex,
        abrev
      );
      listItem.addEventListener("click", this.onNoteClicked);
      this.noteList.appendChild(listItem);
      if (active) {
        this.editor.innerHTML = editor;
        this.activeNoteIndex = noteIndex;
        this.noteDate.innerHTML = extense;
      }
    });
  }

  format(tagName) {
    const { origin, data } = this.formatter.format(tagName);
    this.editor.innerHTML = this.editor.innerHTML.replace(origin, data);
  }

  resetList() {
    this.noteList.innerHTML = "";
  }

  onNoteClicked = (event) => {
    this.resetActiveNotes(); // problemas de escopo
    const index = event.currentTarget.getAttribute("data-note-index");
    this.notes[index].active = true;
    this.saveState();
    this.render();
  };

  resetActiveNotes() {
    this.notes = this.notes.map((note) => ({ ...note, active: false }));
  }

  getActiveNote() {
    return this.notes[this.activeNoteIndex] || {};
  }

  getTitleText(chars = 20) {
    const line = (this.editor.innerText || "").split("\n");
    return line[0].substr(0, chars);
  }

  getResumeText() {
    const secondLine = this.editor.innerText.split("\n");
    if (secondLine[1]) {
      return secondLine[1]
        .replace(this.getActiveNote().title, "")
        .trim()
        .substr(0, 20)
        .replace(/\n/g, "");
    }
    return "";
  }

  newNote() {
    this.resetActiveNotes();
    const index = this.notes.length + 1;
    const note = {
      title: `Nota sem título ${index}`,
      dateTime: moment(),
      editor: `<h1>Nota sem título ${index}</h1>`,
      active: true,
    };

    this.notes.push(note);
    this.render();
  }

  resetDefaultActive(index = 0) {
    if (typeof this.notes[index] !== "undefined") {
      this.resetActiveNotes();
      this.notes[index].active = true;
    }
  }

  removeNote() {
    const del = confirm("Deseja mesmo remover esta nota?");
    if (del) {
      if (this.activeNoteIndex > -1) {
        this.notes.splice(this.activeNoteIndex, 1);
        this.clearContent();
      }
      this.resetDefaultActive();
      this.saveState();
      this.render();
    }
  }

  clearActiveItems() {
    document.querySelectorAll(".note-item").forEach((note) => {
      note.classList.remove("active");
    });
  }

  clearContent() {
    this.editor.innerHTML = "";
  }

  saveState() {
    try {
      localStorage.setItem("folder::notes", JSON.stringify(this.notes));
    } catch (e) {
      console.log("Erro ao salvar notas", e);
    }
  }

  loadState() {
    try {
      this.notes = JSON.parse(localStorage.getItem("folder::notes")) || [];
    } catch (error) {
      console.log("Erro ao recuperar notas", error);
    }
    return null;
  }
}
export default Core;
