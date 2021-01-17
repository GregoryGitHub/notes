import moment from "../../dependencies/moment/moment.js";
import Formatter from "../modules/formatter.js";
import Builder from "../modules/builder.js";
import Editor from "../modules/editor.js";
import NoteManager from "../modules/note-manager.js";
/**
 * Classe Responsável por escutar todos os comandos da interface com o usuário
 * @author José Henrique Gregorio da Silva <henriquegreg45@gmail.com>
 *
 */
export default class AppController {
  constructor() {
    this.formatter = new Formatter();
    this.builder = new Builder();
    this.noteManager = new NoteManager();
    this.editor = new Editor(this.noteManager);
    this.onInit();
  }

  onInit() {
    this.noteManager.loadState();
    this.editor.onInput(this.listenInput);
    this.render();
  }

  listenInput = (event) => {
    this.noteManager.getActiveNote().title = this.editor.getTitleText();
    this.noteManager.getActiveNote().resume = this.editor.getResumeText();
    this.noteManager.getActiveNote().content = this.editor.getContent();
    this.noteManager.getActiveNote().dateTime = moment();
    this.noteManager.renderActiveNote();
  };

  render() {
    this.noteManager.resetList();
    this.noteManager.getNotes().forEach((note, noteIndex) => {
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
      this.noteManager.appendNote(listItem);
      if (active) {
        this.editor.setContent(content);
        this.noteManager.setActiveNoteIndex(noteIndex);
        this.noteManager.setDateDescription(extense);
      }
    });
  }

  format(tagName) {
    const { searchValue, replaceValue } = this.formatter.format(tagName);
    this.editor.replaceContent(searchValue, replaceValue);
  }

  onNoteClicked = (event) => {
    this.noteManager.onNoteClicked(event);
    this.render();
  };

  newNote() {
    this.noteManager.newNote();
    this.render();
  }

  removeNote() {
    this.noteManager.removeNote();
    this.editor.clearContent();
    this.render();
  }

  start() {
    const addNoteBTN = document.getElementById("add-note");
    const removeNoteBTN = document.getElementById("remove-note");
    const fontFormatBTN = document.getElementById("font-format");
    const subMenuFontsBTN = document.getElementById("submenu-fonts");
    const notesRef = document.querySelectorAll(".sub-item");

    addNoteBTN.addEventListener("click", () => this.newNote());
    removeNoteBTN.addEventListener("click", () => this.removeNote());
    fontFormatBTN.addEventListener("click", () => {
      subMenuFontsBTN.classList.toggle("hidden");
    });

    notesRef.forEach((sub) => {
      sub.addEventListener("click", (event) => {
        event.preventDefault();
        const tag = (event.currentTarget || {}).getAttribute("data-tag");
        this.format(tag);
        subMenuFontsBTN.classList.add("hidden");
      });
    });
  }
}
