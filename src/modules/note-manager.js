/**
 * Classe de gerenciamento das notas.
 * Adicionar, Excluir, Renderizar notas são tarefas dessa classe.
 * @author José Henrique Gregorio da Silva <henriquegreg45@gmail.com>
 */

import moment from "../../dependencies/moment/moment.js";
import Formatter from "../modules/formatter.js";
export default class NoteManager {
  constructor() {
    this.formatter = new Formatter();
    this.noteDate = document.getElementById("note-date");
    this.noteList = document.getElementById("note-list");
    this.notes = [];
    this.activeNoteIndex = 0;
  }

  appendNote(noteItem) {
    this.noteList.appendChild(noteItem);
  }

  setActiveNoteIndex(index) {
    this.activeNoteIndex = index;
  }

  setDateDescription(dateDesc) {
    this.noteDate.innerHTML = dateDesc;
  }

  getNotes() {
    return this.notes;
  }

  onNoteClicked(event) {
    this.resetActiveNotes(); // problemas de escopo
    const index = event.currentTarget.getAttribute("data-note-index");
    this.notes[index].active = true;
    this.saveState();
  }

  renderActiveNote() {
    const { title, resume, dateTime } = this.getActiveNote();
    const { abrev, extense } = this.formatter.formatNoteDate(dateTime);
    const activeItemDom = document.querySelector(
      `[data-note-index="${this.activeNoteIndex}"]`
    );
    if (activeItemDom) {
      activeItemDom.children[0].innerText = title;
      activeItemDom.children[1].innerText = abrev;
      activeItemDom.children[2].innerText = resume;
      this.setDateDescription(extense);
    }
    this.saveState();
  }

  resetList() {
    this.noteList.innerHTML = "";
  }

  resetActiveNotes() {
    this.notes = this.notes.map((note) => ({ ...note, active: false }));
  }

  getActiveNote() {
    return this.notes[this.activeNoteIndex] || {};
  }

  newNote() {
    this.resetActiveNotes();
    const index = this.notes.length + 1;
    const note = {
      title: `Nota sem título ${index}`,
      dateTime: moment(),
      content: `<h1>Nota sem título ${index}</h1>`,
      active: true,
    };

    this.notes.push(note);
    this.saveState();
  }

  resetDefaultActive(index = 0) {
    if (typeof this.notes[index] !== "undefined") {
      this.resetActiveNotes();
      this.notes[index].active = true;
    }
  }

  removeNote() {
    const noteTitle = this.getActiveNote().title;
    const del = confirm("Deseja apagar '" + noteTitle + "' ?");
    if (del) {
      if (this.activeNoteIndex > -1) {
        this.notes.splice(this.activeNoteIndex, 1);
      }
      this.resetDefaultActive();
      this.saveState();
    }
  }

  clearActiveItems() {
    document.querySelectorAll(".note-item").forEach((note) => {
      note.classList.remove("active");
    });
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
