export default class Builder {
  constructor() {}

  buildFolderItem(folderName) {
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", this.makeIdByString("folder", folderName));
    a.classList.add("note-item");
    a.innerText = folderName;
    return a;
  }

  buildTable(rows, collums) {
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
    return table;
  }

  buildNoteListItem(
    noteTitle,
    noteResume,
    noteActive,
    noteIndex,
    noteDateAbrev
  ) {
    const noteItem = document.createElement("div");
    const title = document.createElement("h4");
    const date = document.createElement("span");
    const p = document.createElement("p");

    title.innerText = noteTitle;
    date.innerText = noteDateAbrev;
    p.innerText = noteResume || "";

    noteItem.appendChild(title);
    noteItem.appendChild(date);
    noteItem.appendChild(p);
    noteItem.classList.add("note-item");
    noteItem.setAttribute("data-note-index", noteIndex);
    noteActive && noteItem.classList.add("active");
    return noteItem;
  }

  makeIdByString(prefix = "", string = "") {
    string = string.toLowerCase();
    return prefix + "-" + string.replaceAll(/\s/, "-");
  }
}
