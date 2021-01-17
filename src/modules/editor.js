export default class Editor {
  constructor(noteManager) {
    this.editor = document.getElementById("editor");
    this.editor.spellcheck = false;
    this.noteManager = noteManager;
    this.registerListeners();
  }

  registerListeners() {
    this.editor.addEventListener("keydown", this._insertTab);
  }

  onInput(fn) {
    this.editor.addEventListener("input", fn);
  }

  _insertTab = (e) => {
    if (e.key == "Tab") {
      document.execCommand("insertHTML", false, "&nbsp&nbsp");
    }
  };

  replaceContent(searchValue, replaceValue) {
    this.editor.innerHTML = this.editor.innerHTML.replace(
      searchValue,
      replaceValue
    );
  }

  clearContent() {
    this.editor.innerHTML = "";
  }

  getContent() {
    return this.editor.innerHTML;
  }

  setContent(content) {
    return (this.editor.innerHTML = content);
  }

  getResumeText() {
    const secondLine = this.editor.innerText.split("\n");
    if (secondLine[1]) {
      return secondLine[1]
        .replace(this.noteManager.getActiveNote().title, "")
        .trim()
        .substr(0, 20)
        .replace(/\n/g, "");
    }
    return "";
  }

  getTitleText(chars = 20) {
    const line = (this.editor.innerText || "").split("\n");
    return line[0].substr(0, chars);
  }
}
