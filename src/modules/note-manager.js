/**
 * Classe de gerenciamento das notas.
 * Adicionar, Excluir, Renderizar notas são tarefas dessa classe.
 * @author José Henrique Gregorio da Silva <henriquegreg45@gmail.com>
 */

import moment from "../../dependencies/moment/moment.js";
import Formatter from "../modules/formatter.js";
import Builder from '../modules/builder.js';
import Editor from "../modules/editor.js";

export default class NoteManager {
  constructor() {
    this.formatter = new Formatter();
    this.builder = new Builder();
    this.editor = new Editor();
    this.noteDate = document.getElementById("note-date");
    this.noteList = document.getElementById("note-list");
    this.notes = [];
    this.activeNoteIndex = 0;
  }

  render() {
    this.resetList();
    this.getNotes().forEach((note, noteIndex) => {
      const { title, resume, active, content, dateTime } = note;
      const { extense, abrev } = this.formatter.formatNoteDate(dateTime);
      const listItem = this.builder.buildNoteListItem(
        title,
        resume,
        active,
        noteIndex,
        abrev
      );
      listItem.addEventListener("click", this.onNoteClicked);
      this.appendNote(listItem);
      if (active) {
        this.editor.setContent(content);
        this.setActiveNoteIndex(noteIndex);
        this.setDateDescription(extense);
      }
    });
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

  onNoteClicked =(event)=> {
    this.resetActiveNotes(); // problemas de escopo
    const index = event.currentTarget.getAttribute("data-note-index");
    this.notes[index].active = true;
    this.saveState();
    this.render();
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
    this.render();
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
      this.render();
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
      this.render();
    } catch (error) {
      console.log("Erro ao recuperar notas", error);
    }
    return null;
  }
}
