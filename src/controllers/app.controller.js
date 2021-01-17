import moment from "../../dependencies/moment/moment.js";
import Formatter from "../modules/formatter.js";
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
    this.noteManager = new NoteManager();
    this.editor = new Editor(this.noteManager);
    this.onInit();
  }

  onInit() {
    this.noteManager.loadState();
    this.editor.onInput(this.listenInput);
  }

  listenInput = (event) => {
    this.noteManager.getActiveNote().title = this.editor.getTitleText();
    this.noteManager.getActiveNote().resume = this.editor.getResumeText();
    this.noteManager.getActiveNote().content = this.editor.getContent();
    this.noteManager.getActiveNote().dateTime = moment();
    this.noteManager.renderActiveNote();
  };


  format(tagName) {
    const { searchValue, replaceValue } = this.formatter.format(tagName);
    this.editor.replaceContent(searchValue, replaceValue);
  }

  onNoteClicked = (event) => {
    try{
      this.noteManager.onNoteClicked(event);  
    }catch(error){
      console.log('Erro ao selecionar nota', error);
    }
  };

  newNote() {
    try{
      this.noteManager.newNote();
    }catch(error){
      console.log('Erro ao criar nova nota.',error)
    }
  }

  newTable(){

  }

  removeNote() {
    try{
      this.noteManager.removeNote();
      this.editor.clearContent();
    }catch(error){
      console.log('Erro ao remover nota',error);
    }
  }

  start() {
    const addNoteBTN = document.getElementById("add-note");
    const addTableBTN = document.getElementById("add-table");
    const removeNoteBTN = document.getElementById("remove-note");
    const fontFormatBTN = document.getElementById("font-format");
    const subMenuFontsBTN = document.getElementById("submenu-fonts");
    const subMenuTableBTN = document.getElementById("submenu-table");
    const notesRef = document.querySelectorAll(".sub-item");

    addNoteBTN.addEventListener("click", () => this.newNote());
    removeNoteBTN.addEventListener("click", () => this.removeNote());
    fontFormatBTN.addEventListener("click", () => {
      subMenuFontsBTN.classList.toggle("hidden");
    });
    addTableBTN.addEventListener("click", () => {
      subMenuTableBTN.classList.toggle("hidden");
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
