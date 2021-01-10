
class Core {
  
  constructor(){
    this.noteList = document.getElementById('note-list');
    this.editor = document.getElementById('editor');
    this.notes = [{
      title:"Nota sem título",
      dateTime: "10/01/2020 13:00",
      resume:"Lorem ipsum dolor elit",
      editor: `<h1>Nota sem título</h1> 
               <p>
                  Lorem ipsum dolor elit.
                  Expedita inventore, culpa veniam commodi dicta voluptates 
               </p>`,
      active:true
    }];
    this.activeNoteIndex =0;
    this.onInit();
  }


  onInit(){
    this.loadState();
    this.render();
    this.editor.addEventListener('input',this.listenInput)

  }

  listenInput = (event)=>{
    this.getActiveNote().title = this.getFirstLineValue();
    this.getActiveNote().resume = (this.editor.innerText.replace(this.getActiveNote().title,'')).trim().substr(0,18);
    this.getActiveNote().editor = this.editor.innerHTML;
    
    this.saveState();
    this.renderActiveNote();
  }

  renderActiveNote(){
    const {title, resume, dateTime, editor} = this.getActiveNote();
    const activeItemDom = document.querySelector(`[data-note-index="${this.activeNoteIndex}"]`);
    activeItemDom.children[0].innerText = title;
    activeItemDom.children[2].innerText = resume;
  }

  render(){
    this.resetList();
    this.notes.forEach((note,i)=>{

      const listItem = this._createNoteListItem(note,i);
      listItem.addEventListener('click',this.onNoteClicked)
      this.noteList.appendChild(listItem);
      if(note.active){
        this.editor.innerHTML = note.editor;
        this.activeNoteIndex = i;

      };

    })
  }
  
  resetList(){
    this.noteList.innerHTML = "";
  }

  onNoteClicked = (event)=>{
    this.resetActiveNotes(); // problemas de escopo
    const index = event.currentTarget.getAttribute('data-note-index');
    this.notes[index].active = true;
    this.saveState();
    this.render();
  }

  resetActiveNotes(){
    this.notes = this.notes.map(note=>({ ...note, active:false }));
  }

  getActiveNote(){
    return this.notes[this.activeNoteIndex] || {};
  }

  getFirstLineValue(chars=18){
    return ((this.editor).innerText || '').substr(0,chars).trim();
  }


  _createNoteListItem(note,noteIndex){
 
    const noteItem = document.createElement("div");
    const title = document.createElement("h4");
    const date = document.createElement("span");
    const p = document.createElement("p");
    const now = new Date();

    title.innerText = `${note.title}`;
    date.innerText = "12:00";
    p.innerText = (note.resume)|| "";

    noteItem.appendChild(title);
    noteItem.appendChild(date);
    noteItem.appendChild(p);
    noteItem.classList.add("note-item");
    noteItem.setAttribute('data-note-index',noteIndex)
    note.active && noteItem.classList.add('active');
    return noteItem;
  }

  newNote() {
    this.resetActiveNotes();
    const index = this.notes.length + 1;
    const note = {
      title:`Nota sem título ${index}`,
      dateTime: "10/01/2020 13:00",
      editor: `<h1>Nota sem título ${index}</h1>`,
      active:true
    };

    this.notes.push(note);
    this.render();
  }

  resetDefaultActive(index =0){
    if(typeof this.notes[index] !== "undefined"){
      this.resetActiveNotes();
      this.notes[index].active = true;
    }
  }

  removeNote(){
    if(this.activeNoteIndex > -1){
      this.notes.splice(this.activeNoteIndex,1);
      this.clearContent();
    }
    this.resetDefaultActive();
    this.saveState();
    this.render();
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

  saveState(){
      try{
        localStorage.setItem('notes',JSON.stringify(this.notes));
      }catch(e){
        console.log('Erro ao salvar notas',e)
      }
  }

  loadState(){
    try {
      this.notes =  JSON.parse(localStorage.getItem('notes')) || [];
    } catch (error) {
      console.log('Erro ao recuperar notas',error)
    }
    return null;
  }

}

const core = new Core();
