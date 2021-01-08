class Core {
  notes = [];
  activeNote = {};
  addNoteOnList() {
    this.clearContent();
    const noteItem = document.createElement("div");
    const title = document.createElement("h4");
    const titleOnContent = document.createElement("h1");
    const date = document.createElement("span");
    const p = document.createElement("p");
    const now = new Date();

    title.innerText = "Nota sem título";
    titleOnContent.innerText = "Nota sem título\n";
    date.innerText = "12:00";
    p.innerText = "";

    p.appendChild(date);
    noteItem.appendChild(title);
    noteItem.appendChild(p);
    noteItem.classList.add("note-item");

    this.notes.push({ note: noteItem, content: null });
    document.getElementById("note-list").appendChild(noteItem);

    this.setContent(titleOnContent);

    noteItem.addEventListener("click", (event) => {
      this.activeNote = event.currentTarget;
      this.clearActiveItems();
      this.activeNote.classList.add("active");
      console.log(event.target);
    });
  }

  clearActiveItems() {
    document.querySelectorAll(".note-item").forEach((note) => {
      note.classList.remove("active");
    });
  }

  clearContent() {
    document.getElementById("content-editable").innerHTML = "";
  }

  setContent(content) {
    document.getElementById("content-editable").appendChild(content);
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
}

const core = new Core();
