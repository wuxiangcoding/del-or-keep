export function createElement(tagName, options = {}, children = []) {
  const element = document.createElement(tagName);
  const { className, text, html, attrs = {}, events = {} } = options;

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  if (html !== undefined) {
    element.innerHTML = html;
  }

  for (const [name, value] of Object.entries(attrs)) {
    if (value !== false && value !== null && value !== undefined) {
      element.setAttribute(name, String(value));
    }
  }

  for (const [name, handler] of Object.entries(events)) {
    element.addEventListener(name, handler);
  }

  appendChildren(element, children);
  return element;
}

export function appendChildren(parent, children) {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) {
      continue;
    }

    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function replaceChildren(parent, children) {
  parent.replaceChildren();
  appendChildren(parent, children);
}
