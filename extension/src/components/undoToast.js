import { createElement } from "../utils/dom.js";

export function createUndoToast({ bookmark, onUndo }) {
  return createElement("aside", { className: "undo-toast", attrs: { "aria-live": "polite" } }, [
    createElement("div", { className: "undo-toast__copy" }, [
      createElement("p", { className: "undo-toast__title", text: "Bookmark deleted" }),
      createElement("p", { className: "undo-toast__bookmark", text: bookmark.title || bookmark.url })
    ]),
    createElement("button", {
      className: "undo-toast__action",
      text: "Undo",
      attrs: { type: "button" },
      events: { click: onUndo }
    })
  ]);
}
