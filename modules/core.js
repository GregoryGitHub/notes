import moment from "../dependencies/moment/moment.js";
import "../dependencies/moment/locale/pt-br.js";
import Formatter from "./formatter.js";

class Core {
  constructor() {
    moment.locale("pt-br");
    this.formatter = new Formatter();
    this.noteList = document.getElementById("note-list");
    this.editor = document.getElementById("editor");
    this.noteDate = document.getElementById("note-date");
    this.editor.spellcheck = false;
    this.notes = [];
    this.activeNoteIndex = 0;
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
    this.notes.forEach((note, i) => {
      const listItem = this._createNoteListItem(note, i);
      listItem.addEventListener("click", this.onNoteClicked);
      this.noteList.appendChild(listItem);
      if (note.active) {
        this.editor.innerHTML = note.editor;
        this.activeNoteIndex = i;
        this.noteDate.innerHTML = this.getNoteDate(note).extense;
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

  getNoteDate(note) {
    const { dateTime } = note;
    moment.locale("pt-br");
    const dateObj = moment(dateTime);
    let date;
    if (dateTime) {
      const today = moment().format("DD/MM/YYYY");
      const noteDate = dateObj.format("DD/MM/YYYY");
      if (noteDate == today) {
        date = dateObj.format("HH:mm");
      } else {
        date = dateObj.format("DD/MM");
      }
    }
    return { abrev: date, extense: this.capitalize(dateObj.format("LLLL")) };
  }

  _createNoteListItem(note, noteIndex) {
    const noteItem = document.createElement("div");
    const title = document.createElement("h4");
    const date = document.createElement("span");
    const p = document.createElement("p");

    title.innerText = `${note.title}`;
    date.innerText = this.getNoteDate(note).abrev;
    p.innerText = note.resume || "";

    noteItem.appendChild(title);
    noteItem.appendChild(date);
    noteItem.appendChild(p);
    noteItem.classList.add("note-item");
    noteItem.setAttribute("data-note-index", noteIndex);
    note.active && noteItem.classList.add("active");
    return noteItem;
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

  addTableOnContent(rows, collums) {
    const table = document.createElement("table");
    table.classList.add("_inner_content_table");
    table.setAttribute("cellspacing", "0");
    if (collums && rows) {
      for (let i = 1; i <= rows; i++) {
        const tr = document.createElement("tr");
        for (let j = 1; j <= collums; j++) {
          const td = document.createElement("td");
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
    }
    document.getElementById("content-editable").appendChild(table);
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

  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
}
export default Core;
