class Core {
  
  constructor(){
    this.noteList = document.getElementById('note-list');
    this.editor = document.getElementById('editor');
    this.notes = [{
      title:"Nota sem título",
      dateTime: "10/01/2020 13:00",
      editor: `<h1>Nota sem título</h1> 
               <p>
                  Lorem ipsum dolor elit.
                  Expedita inventore, culpa veniam commodi dicta voluptates 
               </p>`,
      active:true
    }];

    this.onInit();
  }


  onInit(){
    this.render();
  }

  render(){
    this.resetList();
    this.notes.forEach((note,i)=>{

      const listItem = this._createNoteListItem(note,i);
      this.noteList.appendChild(listItem);

    })
  }
  
  resetList(){
    this.noteList.innerHTML = "";
  }

  resetActiveNotes(){
    this.notes = this.notes.map(note=>({ ...note, active:false }));
  }

  getActiveNote(){
    return (this.allNotes || []).find(n=>n.className.includes('active'));
  }

  getFirstLineValue(chars=18){
    return ((this.editor).innerText || '').substr(0,chars);
  }

  updateNoteTitle(title){
    if(title == '') title = "Nota sem título"
    return this.getActiveNote().children[0].innerText = title.trim();
  }

  _createNoteListItem(note,noteIndex){
 
    const noteItem = document.createElement("div");
    const title = document.createElement("h4");
    const titleOnContent = document.createElement("h1");
    const date = document.createElement("span");
    const p = document.createElement("p");
    const now = new Date();

    title.innerText = `${note.title} ${noteIndex + 1}`;
    titleOnContent.innerHTML = `${note.title} ${noteIndex + 1}`;
    date.innerText = "12:00";
    p.innerText = "";

    p.appendChild(date);
    noteItem.appendChild(title);
    noteItem.appendChild(p);
    noteItem.classList.add("note-item");
    note.active && noteItem.classList.add('active');
    return noteItem;
  }

  newNote() {
    this.resetActiveNotes();
    const note = {
      title:"Nota sem título",
      dateTime: "10/01/2020 13:00",
      editor: `<h1>Nota sem título</h1>`,
      active:true
    };

    this.notes.push(note);
    this.render();
  }

  removeNoteOnList(){
    this.notes.removeChild(this.getActiveNote());
    this.editor.innerHTML = "";
  }

  setActiveNote(note){
    this.clearActiveItems();
    note.classList.add('active');
    const noteIndex = this.allNotes.indexOf(note);
    const _note = this.allNotes[noteIndex];
    this.setContent(_note._editor)
  }


  clearActiveItems() {
    document.querySelectorAll(".note-item").forEach((note) => {
      note.classList.remove("active");
    });
  }

  clearContent() {
    this.editor.innerHTML = "";
  }

  setContent(content) {
    if(content){
      this.editor.innerHTML = content;
    }
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

  saveNotes(){
    console.log(JSON.stringify(this.allNotes))
    try{
      localStorage.setItem('notes',JSON.stringify(this.allNotes));
      localStorage.setItem('note-list',document.getElementById('note-list').innerHTML);
    }catch(e){
      console.log('Erro ao salvar notas',e)
    }
  }

  loadNotes(){
    try {
      this.allNotes =  JSON.parse(localStorage.getItem('notes'));
      //document.getElementById('note-list').innerHTML = localStorage.getItem('note-list') || "";
    } catch (error) {
      console.log('Erro ao recuperar notas',error)
    }
    return null;
  }
}

const core = new Core();
