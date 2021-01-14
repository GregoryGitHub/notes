export default class Formatter {
  H1 = "H1";
  H2 = "H1";
  constructor() {}
  getSelection() {
    try {
      return window.getSelection().getRangeAt(0).toString();
    } catch (e) {
      console.log("Erro ao recuperar seleção");
    }
  }

  getSelectedElements() {
    let elementsOuter = [];
    let elementsInner = [];
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.cloneContents().childNodes.forEach((n) => {
      elementsOuter.push(n.outerHTML);
      elementsInner.push(n.innerHTML);
    });

    return {
      parentOuterHTML:
        ((range.commonAncestorContainer || {}).parentElement || {}).outerHTML ||
        "",
      parentInnerText:
        ((range.commonAncestorContainer || {}).parentElement || {}).innerText ||
        "",
      elementsOuterHTML: elementsOuter.join(""),
      elementsInnerHTML: elementsInner.join(""),
    };
  }

  format(tagName) {
    let origin = "";
    const {
      parentOuterHTML,
      parentInnerText,
      elementsOuterHTML,
      elementsInnerHTML,
    } = this.getSelectedElements();
    let selectionText = this.getSelection();

    if (parentInnerText.trim() !== selectionText.trim()) {
      origin = elementsOuterHTML || selectionText;
    } else {
      origin = parentOuterHTML;
    }
    return {
      origin,
      data: `<${tagName}>${
        elementsInnerHTML || this.htmlEncode(selectionText)
      }</${tagName}>`,
    };
  }

  htmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
  }
  htmlDecode(input) {
    var e = document.createElement("textarea");
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
}
