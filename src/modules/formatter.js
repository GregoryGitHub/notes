import moment from "../../dependencies/moment/moment.js";
import "../../dependencies/moment/locale/pt-br.js";
export default class Formatter {
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
      searchValue: origin,
      replaceValue: `<${tagName}>${
        elementsInnerHTML || this.htmlEncode(selectionText)
      }</${tagName}>`,
    };
  }

  formatNoteDate(dateTime) {
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

  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

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
