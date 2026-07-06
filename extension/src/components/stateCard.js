import { createElement } from "../utils/dom.js";

export function createStateCard({ variant = "default", kicker, title, body, actions = [] }) {
  return createElement("section", { className: `state-card state-card--${variant}` }, [
    kicker ? createElement("p", { className: "state-kicker", text: kicker }) : null,
    createElement("h1", { text: title }),
    body ? createElement("p", { className: "state-copy", text: body }) : null,
    actions.length ? createElement("div", { className: "state-actions" }, actions) : null
  ]);
}

export function createLoadingCard() {
  return createElement("section", { className: "bookmark-card bookmark-card--loading", attrs: { "aria-busy": "true" } }, [
    createElement("div", { className: "skeleton skeleton--label" }),
    createElement("div", { className: "skeleton skeleton--title" }),
    createElement("div", { className: "skeleton skeleton--url" }),
    createElement("div", { className: "skeleton-row" }, [
      createElement("div", { className: "skeleton skeleton--meta" }),
      createElement("div", { className: "skeleton skeleton--meta" }),
      createElement("div", { className: "skeleton skeleton--meta" })
    ]),
    createElement("div", { className: "skeleton-row skeleton-row--actions" }, [
      createElement("div", { className: "skeleton skeleton--button" }),
      createElement("div", { className: "skeleton skeleton--button" }),
      createElement("div", { className: "skeleton skeleton--button" })
    ])
  ]);
}
