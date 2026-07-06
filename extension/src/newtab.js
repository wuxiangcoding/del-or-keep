import { createBookmarkCard } from "./components/bookmarkCard.js";
import { createQueuePanel } from "./components/queuePanel.js";
import { createLoadingCard, createStateCard } from "./components/stateCard.js";
import { createUndoToast } from "./components/undoToast.js";
import { applyDailyBackgroundImage } from "./services/backgroundImage.js";
import { deleteBookmark, getNextBookmark, keepBookmark, openBookmark, restoreDeletedBookmark } from "./services/queue.js";
import { createElement, replaceChildren } from "./utils/dom.js";

const app = document.querySelector("#app");

let currentBookmark = null;
let currentPayload = null;
let lastDeletedBookmark = null;
let isConfirmingDelete = false;
let isBusy = false;

function createActionButton(label, variant, onClick) {
  return createElement("button", {
    className: `action-button action-button--${variant}`,
    text: label,
    attrs: { type: "button" },
    events: { click: onClick }
  });
}

function renderShell(content, queueData = currentPayload) {
  const workspaceChildren = queueData === null ? [content] : [content, createQueuePanel(queueData)];
  const shell = createElement("div", { className: "page-shell" }, [
    createElement("header", { className: "topbar" }, [
      createElement("div", { className: "brand-lockup" }, [
        createElement("div", { className: "brand-mark", text: "D/K", attrs: { "aria-hidden": "true" } }),
        createElement("div", {}, [
          createElement("p", { className: "product-mark", text: "Del or Keep" }),
          createElement("p", { className: "hero-copy", text: "Bookmark review queue" })
        ])
      ]),
      createElement("div", { className: "review-badge", text: "30+ day filter" })
    ]),
    createElement("div", { className: `workspace${queueData === null ? " workspace--single" : ""}` }, workspaceChildren)
  ]);
  const children = [shell];

  if (lastDeletedBookmark) {
    children.push(createUndoToast({ bookmark: lastDeletedBookmark, onUndo: handleUndoDelete }));
  }

  replaceChildren(app, children);
}

function renderLoading() {
  renderShell(createLoadingCard(), null);
}

function renderEmpty(payload) {
  currentBookmark = null;
  currentPayload = payload;
  isConfirmingDelete = false;

  renderShell(
    createStateCard({
      variant: "empty",
      kicker: "Clear",
      title: "No old bookmarks left",
      body: "Newer bookmarks stay out of the queue until they pass the age filter."
    }),
    payload
  );
}

function renderError(error) {
  renderShell(
    createStateCard({
      variant: "error",
      kicker: "Error",
      title: "Unable to review bookmarks",
      body: error?.message ?? "Reload the tab or check extension permissions.",
      actions: [createActionButton("Try again", "secondary", loadNextBookmark)]
    })
  );
}

function renderBookmark(payload) {
  currentPayload = payload;
  currentBookmark = payload.bookmark;

  renderShell(
    createBookmarkCard({
      bookmark: payload.bookmark,
      shown: payload.shown,
      expiryMs: payload.expiryMs,
      minAgeMs: payload.minAgeMs,
      confirmDelete: isConfirmingDelete,
      onOpen: handleOpen,
      onKeep: handleKeep,
      onDelete: handleDelete,
      onCancelDelete: handleCancelDelete,
      onConfirmDelete: handleConfirmDelete
    }),
    payload
  );
}

async function loadNextBookmark() {
  if (isBusy) {
    return;
  }

  isBusy = true;
  renderLoading();

  try {
    const payload = await getNextBookmark();

    if (!payload.bookmark) {
      renderEmpty(payload);
      return;
    }

    isConfirmingDelete = false;
    renderBookmark(payload);
  } catch (error) {
    console.error(error);
    renderError(error);
  } finally {
    isBusy = false;
  }
}

async function handleOpen() {
  if (!currentBookmark || isBusy) {
    return;
  }

  isBusy = true;

  try {
    await openBookmark(currentBookmark);
  } catch (error) {
    console.error(error);
    renderError(error);
    isBusy = false;
    return;
  }

  isBusy = false;
  await loadNextBookmark();
}

async function handleKeep() {
  if (!currentBookmark || isBusy) {
    return;
  }

  isBusy = true;

  try {
    await keepBookmark(currentBookmark.id);
  } catch (error) {
    console.error(error);
    renderError(error);
    isBusy = false;
    return;
  }

  isBusy = false;
  await loadNextBookmark();
}

function handleDelete() {
  if (!currentBookmark || isBusy) {
    return;
  }

  isConfirmingDelete = true;
  renderBookmark(currentPayload);
}

function handleCancelDelete() {
  if (!currentPayload || isBusy) {
    return;
  }

  isConfirmingDelete = false;
  renderBookmark(currentPayload);
}

async function handleConfirmDelete() {
  if (!currentBookmark || isBusy) {
    return;
  }

  isBusy = true;

  try {
    lastDeletedBookmark = await deleteBookmark(currentBookmark);
  } catch (error) {
    console.error(error);
    renderError(error);
    isBusy = false;
    return;
  }

  isBusy = false;
  await loadNextBookmark();
}

async function handleUndoDelete() {
  if (!lastDeletedBookmark || isBusy) {
    return;
  }

  isBusy = true;

  try {
    await restoreDeletedBookmark(lastDeletedBookmark);
    lastDeletedBookmark = null;
  } catch (error) {
    console.error(error);
    renderError(error);
    isBusy = false;
    return;
  }

  isBusy = false;

  if (currentBookmark && currentPayload?.bookmark) {
    renderBookmark(currentPayload);
    return;
  }

  await loadNextBookmark();
}

applyDailyBackgroundImage();
loadNextBookmark();
